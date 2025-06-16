"use client"

import { useState } from "react"
import type { StockData, CalculationInputs } from "@/types/stock"
import { performCalculations, formatPercentage, formatPrice } from "@/utils/calculations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StockSelector } from "./stock-selector"
import { X } from "lucide-react"

interface StockComparisonProps {
  stocks: StockData[]
  inputs: CalculationInputs
}

export function StockComparison({ stocks, inputs }: StockComparisonProps) {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])

  const addStock = (stockCode: string) => {
    if (!selectedStocks.includes(stockCode) && selectedStocks.length < 5) {
      setSelectedStocks([...selectedStocks, stockCode])
    }
  }

  const removeStock = (stockCode: string) => {
    setSelectedStocks(selectedStocks.filter((code) => code !== stockCode))
  }

  const comparisonData = selectedStocks.map((code) => {
    const stock = stocks.find((s) => s.code === code)!
    const results = performCalculations(stock, inputs)
    return { stock, results }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>股票比较</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <StockSelector
              stocks={stocks.filter((s) => !selectedStocks.includes(s.code))}
              selectedStock=""
              onStockChange={addStock}
            />
          </div>
        </div>

        {selectedStocks.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedStocks.map((code) => {
                const stock = stocks.find((s) => s.code === code)!
                return (
                  <div key={code} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                    <span>{stock.name}</span>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeStock(code)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">股票</th>
                    <th className="text-right p-2">当前价格</th>
                    <th className="text-right p-2">可接受价格</th>
                    <th className="text-right p-2">预估股息率</th>
                    <th className="text-right p-2">价格差异</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map(({ stock, results }) => {
                    const priceDiff = results.acceptablePrice - stock.currentPrice
                    const isAttractive = priceDiff > 0
                    return (
                      <tr key={stock.code} className="border-b">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{stock.name}</div>
                            <div className="text-xs text-muted-foreground">{stock.code}</div>
                          </div>
                        </td>
                        <td className="text-right p-2">{formatPrice(stock.currentPrice)}</td>
                        <td className="text-right p-2">{formatPrice(results.acceptablePrice)}</td>
                        <td className="text-right p-2">{formatPercentage(results.estimatedDividendRate)}</td>
                        <td className={`text-right p-2 ${isAttractive ? "text-green-600" : "text-red-600"}`}>
                          {isAttractive ? "+" : ""}
                          {formatPrice(priceDiff)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedStocks.length === 0 && <p className="text-center text-muted-foreground py-8">请选择股票进行比较</p>}
      </CardContent>
    </Card>
  )
}
