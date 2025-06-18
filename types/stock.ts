export interface StockData {
  code: string // 股票代码
  name: string // 公司名称
  lastYearNetProfit: number // 去年净利润（亿元）
  specialPreferenceAdjustment?: number // 特殊业绩调整项（亿元，可选）
  specialPreferenceAdjustmentDesc?: string // 特殊业绩调整项描述（可选）
  minDividendPayoutRatio: number // 公司公告的最低股息支付率（0-1）
  minDividendPayoutRatioDesc?: string // 最低股息支付率描述（可选）
  defaultGrowthRate: number // 预估的未来净利润增长系数（默认值）
  currentMarketCap: number // 公司当前总市值（亿元）
  totalShares: number // 公司总股本（亿股）
  currentPrice: number // 公司当前股价（元）
  defaultTargetDividendRate: number // 目标股息率（默认值，0-1）
  cancellationBuyback: number // 注销式回购（亿元）
  lastUpdated: string // 最后更新时间
}

export interface CalculationInputs {
  growthRate: number // 预估的未来净利润增长系数
  targetDividendRate: number // 目标股息率
}

export interface CalculationResults {
  estimatedDividendRate: number // 预估的股息率
  acceptablePrice: number // 可接受的价格
}
