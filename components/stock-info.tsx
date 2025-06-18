"use client"

import type { StockData } from "@/types/stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleTooltip } from "@/components/ui/simple-tooltip"
import { HelpCircle } from "lucide-react"
import {
  formatLargeNumber,
  formatPrice,
  formatPercentage,
  formatSignedNumber,
  calculatePE,
  calculateCurrentDividendYield,
  getAdjustedNetProfit,
} from "@/utils/calculations"

interface StockInfoProps {
  stock: StockData
}

export function StockInfo({ stock }: StockInfoProps) {
  const adjustedNetProfit = getAdjustedNetProfit(stock)
  const pe = calculatePE(stock)
  const currentDividendYield = calculateCurrentDividendYield(stock)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>{stock.name}</span>
            <span className="text-sm font-normal text-muted-foreground">{stock.code}</span>
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            更新：{new Date(stock.lastUpdated).toLocaleDateString("zh-CN")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">当前股价：</span>
            <span className="font-medium">{formatPrice(stock.currentPrice)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">总市值：</span>
            <span className="font-medium">{formatLargeNumber(stock.currentMarketCap, "money")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">总股本：</span>
            <span className="font-medium">{formatLargeNumber(stock.totalShares, "shares")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">去年净利润：</span>
            <span className="font-medium">{formatLargeNumber(stock.lastYearNetProfit, "money")}</span>
          </div>

          {/* 特殊业绩调整项 */}
          {stock.specialPreferenceAdjustment !== undefined && (
            <>
              <div className="overflow-visible">
                <span className="text-muted-foreground">特殊业绩调整：</span>
                <span
                  className={`font-medium ml-1 ${stock.specialPreferenceAdjustment >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {formatSignedNumber(stock.specialPreferenceAdjustment)}
                </span>
                {stock.specialPreferenceAdjustmentDesc && (
                  <SimpleTooltip content={stock.specialPreferenceAdjustmentDesc}>
                    <HelpCircle className="inline-block h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors ml-1" />
                  </SimpleTooltip>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">调整后净利润：</span>
                <span className="font-medium">{formatLargeNumber(adjustedNetProfit, "money")}</span>
              </div>
            </>
          )}

          <div className="overflow-visible">
            <span className="text-muted-foreground">最低股息支付率：</span>
            <span className="font-medium ml-1">{formatPercentage(stock.minDividendPayoutRatio)}</span>
            {stock.minDividendPayoutRatioDesc && (
              <SimpleTooltip content={stock.minDividendPayoutRatioDesc}>
                <HelpCircle className="inline-block h-4 w-4 text-muted-foreground cursor-help hover:text-foreground transition-colors ml-1" />
              </SimpleTooltip>
            )}
          </div>

          <div>
            <span className="text-muted-foreground">注销式回购：</span>
            <span className="font-medium">
              {stock.cancellationBuyback === 0 ? "-" : formatLargeNumber(stock.cancellationBuyback, "money")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">默认增长系数：</span>
            <span className="font-medium">{stock.defaultGrowthRate.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">市盈率(PE)：</span>
            <span className="font-medium">{pe.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">综合收益率：</span>
            <span className="font-medium">{formatPercentage(currentDividendYield)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
