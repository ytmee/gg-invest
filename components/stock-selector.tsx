"use client"

import type { StockData } from "@/types/stock"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StockSelectorProps {
  stocks: StockData[]
  selectedStock: string
  onStockChange: (stockCode: string) => void
}

export function StockSelector({ stocks, selectedStock, onStockChange }: StockSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">选择股票</label>
      <Select value={selectedStock} onValueChange={onStockChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="请选择一只股票" />
        </SelectTrigger>
        <SelectContent>
          {stocks.map((stock) => (
            <SelectItem key={stock.code} value={stock.code}>
              {stock.code} - {stock.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
