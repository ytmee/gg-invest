import type { StockData, CalculationInputs, CalculationResults } from "@/types/stock"

/**
 * 计算预估股息率
 * 公式：预估的股息率 = (公司去年的净利润 * 预估的未来净利润增长系数 * 公司公告的最低股息支付率 + 注销式回购金额) / 公司当前总市值
 */
export function calculateEstimatedDividendRate(stock: StockData, growthRate: number): number {
  const dividendAmount = stock.lastYearNetProfit * growthRate * stock.minDividendPayoutRatio
  const totalReturn = dividendAmount + stock.cancellationBuyback
  return totalReturn / stock.currentMarketCap
}

/**
 * 计算可接受价格
 * 公式：可接受的价格 = (公司去年的净利润 * 预估的未来净利润增长系数 * 公司公告的最低股息支付率 + 注销式回购金额) / 目标股息率 / 公司总股本
 */
export function calculateAcceptablePrice(stock: StockData, growthRate: number, targetDividendRate: number): number {
  const dividendAmount = stock.lastYearNetProfit * growthRate * stock.minDividendPayoutRatio
  const totalReturn = dividendAmount + stock.cancellationBuyback
  return totalReturn / targetDividendRate / stock.totalShares
}

/**
 * 执行所有计算
 */
export function performCalculations(stock: StockData, inputs: CalculationInputs): CalculationResults {
  return {
    estimatedDividendRate: calculateEstimatedDividendRate(stock, inputs.growthRate),
    acceptablePrice: calculateAcceptablePrice(stock, inputs.growthRate, inputs.targetDividendRate),
  }
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * 格式化价格
 */
export function formatPrice(value: number): string {
  return `¥${value.toFixed(2)}`
}

/**
 * 格式化大数字（亿为单位）
 */
export function formatLargeNumber(value: number, unit: "money" | "shares" = "money"): string {
  if (unit === "shares") {
    return `${value.toFixed(2)}亿股`
  }
  return `${value.toFixed(2)}亿元`
}

/**
 * 计算市盈率 (PE)
 */
export function calculatePE(stock: StockData): number {
  const eps = stock.lastYearNetProfit / stock.totalShares // 每股收益
  return stock.currentPrice / eps
}

/**
 * 计算股息收益率（基于去年数据，包含注销式回购）
 */
export function calculateCurrentDividendYield(stock: StockData): number {
  const dividendPerShare = (stock.lastYearNetProfit * stock.minDividendPayoutRatio) / stock.totalShares
  const buybackPerShare = stock.cancellationBuyback / stock.totalShares
  const totalReturnPerShare = dividendPerShare + buybackPerShare
  return totalReturnPerShare / stock.currentPrice
}
