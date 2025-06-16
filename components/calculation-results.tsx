"use client"

import type { CalculationResults, StockData } from "@/types/stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPercentage, formatPrice } from "@/utils/calculations"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface CalculationResultsProps {
  stock: StockData
  results: CalculationResults
}

export function CalculationResultsComponent({ stock, results }: CalculationResultsProps) {
  const priceComparison = results.acceptablePrice - stock.currentPrice
  const isPriceAttractive = priceComparison > 0

  const getPriceIcon = () => {
    if (Math.abs(priceComparison) < 0.1) return <Minus className="h-4 w-4 text-yellow-500" />
    return isPriceAttractive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getPriceColor = () => {
    if (Math.abs(priceComparison) < 0.1) return "text-yellow-600"
    return isPriceAttractive ? "text-green-600" : "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>计算结果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <span className="font-medium">预估综合收益率：</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPercentage(results.estimatedDividendRate)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <span className="font-medium">可接受价格：</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatPrice(results.acceptablePrice)}
            </span>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">价格分析：</span>
              <div className="flex items-center gap-2">
                {getPriceIcon()}
                <span className={`font-medium ${getPriceColor()}`}>
                  {isPriceAttractive ? "低估" : "高估"} {formatPrice(Math.abs(priceComparison))}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              当前价格 {formatPrice(stock.currentPrice)} vs 可接受价格 {formatPrice(results.acceptablePrice)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">*综合收益率包含现金分红和注销式回购收益</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
