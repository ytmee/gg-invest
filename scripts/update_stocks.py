import json
import akshare as ak
from datetime import datetime
import argparse

def convert_stock_code(original_code):
    """转换股票代码格式: 600519.SH -> sh600519"""
    code, exchange = original_code.split('.')
    return f"{exchange.lower()}{code}"

def update_stock_data(file_path):
    print(f"[{datetime.now()}] 开始更新股票数据，文件路径: {file_path}")

    # 读取JSON文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        print(f"[{datetime.now()}] 成功读取股票数据文件")

    # 更新每只股票的数据
    for stock in data['stocks']:
        try:
            print(f"\n[{datetime.now()}] 开始处理股票: {stock['name']}({stock['code']})")

            # 获取股票信息
            symbol = stock['code'].split('.')[0]  # 移除交易所后缀
            stock_info = ak.stock_individual_info_em(symbol=symbol)

            # 获取企业净利润
            converted_code = convert_stock_code(stock['code'])
            try:
                financial_report = ak.stock_financial_report_sina(stock=converted_code, symbol="利润表")
                for i in range(len(financial_report)):
                    if financial_report.iloc[i]['是否审计'] == '是':
                        net_profit = financial_report.iloc[i]['归属于母公司所有者的净利润']
                        if net_profit:
                            new_profit = round(float(net_profit) / 100000000, 2)  # 转换为亿元
                            if stock['lastYearNetProfit'] == new_profit:
                                print(f"净利润(未更新): {new_profit}")
                            else:
                                old_profit = stock['lastYearNetProfit']
                                stock['lastYearNetProfit'] = new_profit
                                print(f"净利润(更新): {old_profit} -> {new_profit}")
                        break
            except Exception as e:
                print(f"[WARNING] 获取股票 {stock['name']} 净利润数据失败: {e}")

            # 更新股价
            current_price = float(stock_info.loc[stock_info['item'] == '最新', 'value'].values[0])
            if stock['currentPrice'] == current_price:
                print(f"股价(未更新): {current_price}")
            else:
                old_price = stock['currentPrice']
                stock['currentPrice'] = current_price
                print(f"股价(更新): {old_price} -> {current_price}")

            # 更新市值(转换为亿元)
            market_cap = stock_info.loc[stock_info['item'] == '总市值', 'value'].values[0]
            new_market_cap = round(float(market_cap) / 100000000, 2)
            if stock['currentMarketCap'] == new_market_cap:
                print(f"市值(未更新): {new_market_cap}")
            else:
                old_market_cap = stock['currentMarketCap']
                stock['currentMarketCap'] = new_market_cap
                print(f"市值(更新): {old_market_cap} -> {new_market_cap}")

            # 更新总股本(转换为亿股)
            total_shares = stock_info.loc[stock_info['item'] == '总股本', 'value'].values[0]
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
