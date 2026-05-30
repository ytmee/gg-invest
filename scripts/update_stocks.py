import json
from datetime import datetime
import argparse
import time
import re
import requests


EASTMONEY_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept": "application/json,text/plain,*/*",
}

def convert_stock_code(original_code):
    """转换股票代码格式: 600519.SH -> SH600519"""
    code, exchange = original_code.split('.')
    return f"{exchange.upper()}{code}"


def tencent_symbol(stock_code):
    symbol, exchange = stock_code.split('.')
    return f"{exchange.lower()}{symbol}"


def get_json(url, params, headers=None, retries=3, timeout=10):
    last_error = None
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(
                url,
                params=params,
                headers=headers or EASTMONEY_HEADERS,
                timeout=timeout,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            last_error = e
            if attempt < retries:
                time.sleep(attempt * 2)

    raise RuntimeError(f"请求东方财富接口重试 {retries} 次仍失败: {last_error}")


def fetch_stock_quotes_from_tencent(stocks, retries=3, timeout=10):
    query = ",".join(tencent_symbol(stock["code"]) for stock in stocks)
    url = "https://qt.gtimg.cn/q=" + query
    headers = {
        **EASTMONEY_HEADERS,
        "Referer": "https://gu.qq.com/",
    }
    last_error = None
    for attempt in range(1, retries + 1):
        try:
            response = requests.get(url, headers=headers, timeout=timeout)
            response.raise_for_status()
            response.encoding = "gbk"
            text = response.text
            break
        except Exception as e:
            last_error = e
            if attempt < retries:
                time.sleep(attempt * 2)
    else:
        raise RuntimeError(f"腾讯行情接口重试 {retries} 次仍失败: {last_error}")

    code_by_symbol = {
        tencent_symbol(stock["code"]): stock["code"].split(".")[0]
        for stock in stocks
    }
    quotes = {}
    for segment in text.split(";"):
        if '="' not in segment:
            continue
        prefix, raw_values = segment.split('="', 1)
        request_symbol = prefix.replace("v_", "").strip()
        code = code_by_symbol.get(request_symbol)
        if not code:
            continue
        fields = raw_values.rstrip('";\r\n').split("~")
        if len(fields) <= 44:
            raise ValueError(f"腾讯行情字段数量异常: {request_symbol}")

        price = fields[3]
        market_cap = fields[45]
        if price in ("", "-") or market_cap in ("", "-"):
            continue

        price = float(price)
        market_cap = float(market_cap) * 100000000
        if price <= 0:
            continue

        quotes[code] = {
            "最新": price,
            "总市值": market_cap,
            "总股本": market_cap / price,
        }

    return quotes


def fetch_company_type_from_eastmoney(stock_symbol):
    url = "https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index"
    params = {"type": "web", "code": stock_symbol.lower()}
    headers = {
        **EASTMONEY_HEADERS,
        "Referer": f"https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code={stock_symbol.lower()}",
    }
    last_error = None
    for attempt in range(1, 4):
        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            match = re.search(
                r'<input[^>]*id=["\']hidctype["\'][^>]*value=["\']([^"\']+)["\']',
                response.text,
                flags=re.IGNORECASE,
            )
            if not match:
                match = re.search(
                    r'<input[^>]*value=["\']([^"\']+)["\'][^>]*id=["\']hidctype["\']',
                    response.text,
                    flags=re.IGNORECASE,
                )
            if match:
                return match.group(1)
            raise ValueError("未找到 hidctype")
        except Exception as e:
            last_error = e
            if attempt < 3:
                time.sleep(attempt * 2)

    raise RuntimeError(f"获取东方财富 companyType 失败: {last_error}")


def fetch_profit_reports_from_eastmoney(stock_code):
    stock_symbol = convert_stock_code(stock_code)
    company_type = fetch_company_type_from_eastmoney(stock_symbol)
    headers = {
        **EASTMONEY_HEADERS,
        "Referer": f"https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/Index?type=web&code={stock_symbol.lower()}",
    }

    date_payload = get_json(
        "https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/lrbDateAjaxNew",
        {
            "companyType": company_type,
            "reportDateType": "0",
            "code": stock_symbol,
        },
        headers=headers,
    )
    dates = [
        item["REPORT_DATE"][:10]
        for item in date_payload.get("data", [])
        if item.get("REPORT_DATE")
    ]
    if not dates:
        raise ValueError("东方财富利润表未返回报告日期")

    reports = []
    for start in range(0, len(dates), 5):
        payload = get_json(
            "https://emweb.securities.eastmoney.com/PC_HSF10/NewFinanceAnalysis/lrbAjaxNew",
            {
                "companyType": company_type,
                "reportDateType": "0",
                "reportType": "1",
                "code": stock_symbol,
                "dates": ",".join(dates[start:start + 5]),
            },
            headers=headers,
        )
        reports.extend(payload.get("data", []))

    return reports


def extract_latest_annual_parent_net_profit(profit_reports):
    for report in profit_reports:
        if report.get("REPORT_TYPE") != "年报":
            continue
        net_profit = report.get("PARENT_NETPROFIT")
        if net_profit in (None, ""):
            continue
        return round(float(net_profit) / 100000000, 2)
    raise ValueError("未找到年报归母净利润")

def update_stock_data(file_path):
    print(f"[{datetime.now()}] 开始更新股票数据，文件路径: {file_path}")

    # 读取JSON文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        print(f"[{datetime.now()}] 成功读取股票数据文件")

    stock_quotes = {}
    try:
        stock_quotes = fetch_stock_quotes_from_tencent(data['stocks'])
        print(f"[{datetime.now()}] 成功从腾讯批量获取 {len(stock_quotes)} 只股票行情")
    except Exception as e:
        print(f"[WARNING] 批量获取腾讯股票行情失败，将保留已有行情数据: {e}")

    # 更新每只股票的数据
    for stock in data['stocks']:
        try:
            print(f"\n[{datetime.now()}] 开始处理股票: {stock['name']}({stock['code']})")

            # 获取股票行情信息；批量接口不可用时保留原行情数据
            symbol = stock['code'].split('.')[0]
            stock_info = stock_quotes.get(symbol)

            # 获取企业净利润
            try:
                profit_reports = fetch_profit_reports_from_eastmoney(stock['code'])
                new_profit = extract_latest_annual_parent_net_profit(profit_reports)
                if stock['lastYearNetProfit'] == new_profit:
                    print(f"净利润(未更新): {new_profit}")
                else:
                    old_profit = stock['lastYearNetProfit']
                    stock['lastYearNetProfit'] = new_profit
                    print(f"净利润(更新): {old_profit} -> {new_profit}")
            except Exception as e:
                print(f"[WARNING] 获取股票 {stock['name']} 净利润数据失败: {e}")

            if not stock_info:
                print("[WARNING] 未获取到行情数据，保留股价、市值、总股本")
            else:
                # 更新股价
                current_price = float(stock_info["最新"])
                if stock['currentPrice'] == current_price:
                    print(f"股价(未更新): {current_price}")
                else:
                    old_price = stock['currentPrice']
                    stock['currentPrice'] = current_price
                    print(f"股价(更新): {old_price} -> {current_price}")

                # 更新市值(转换为亿元)
                market_cap = stock_info["总市值"]
                new_market_cap = round(float(market_cap) / 100000000, 2)
                if stock['currentMarketCap'] == new_market_cap:
                    print(f"市值(未更新): {new_market_cap}")
                else:
                    old_market_cap = stock['currentMarketCap']
                    stock['currentMarketCap'] = new_market_cap
                    print(f"市值(更新): {old_market_cap} -> {new_market_cap}")

                # 更新总股本(转换为亿股)
                total_shares = stock_info["总股本"]
                new_shares = round(float(total_shares) / 100000000, 2)
                if stock['totalShares'] == new_shares:
                    print(f"总股本(未更新): {new_shares}")
                else:
                    old_shares = stock['totalShares']
                    stock['totalShares'] = new_shares
                    print(f"总股本(更新): {old_shares} -> {new_shares}")

            # 更新最后更新时间
            stock['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
            print(f"最后更新时间设置为: {stock['lastUpdated']}")

        except Exception as e:
            print(f"[ERROR] 更新股票 {stock['name']}({stock['code']}) 数据时出错: {e}")

    # 更新全局最后更新时间
    data['lastUpdated'] = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')

    # 写回JSON文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n[{datetime.now()}] 股票数据已成功更新并保存到文件: {file_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='更新股票数据')
    parser.add_argument('file', help='股票数据JSON文件路径', default='stocks.json', nargs='?')
    args = parser.parse_args()

    update_stock_data(args.file)
