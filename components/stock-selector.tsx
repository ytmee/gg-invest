"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import type { StockData } from "@/types/stock"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface StockSelectorProps {
  stocks: StockData[]
  selectedStock: string
  onStockChange: (stockCode: string) => void
}

export function StockSelector({ stocks, selectedStock, onStockChange }: StockSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedStockData = stocks.find((stock) => stock.code === selectedStock)

  // 过滤股票列表
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 重置高亮索引当搜索结果改变时
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [searchTerm])

  // 点击外部关闭下拉框
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleStockSelect = (stockCode: string) => {
    onStockChange(stockCode)
    setOpen(false)
    setSearchTerm("")
    setHighlightedIndex(0)
  }

  const handleToggle = () => {
    setOpen(!open)
    if (!open) {
      setSearchTerm("")
      setHighlightedIndex(0)
      // 延迟聚焦确保元素已渲染
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filteredStocks.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % filteredStocks.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + filteredStocks.length) % filteredStocks.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredStocks[highlightedIndex]) {
          handleStockSelect(filteredStocks[highlightedIndex].code)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">选择股票</label>
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          onClick={handleToggle}
        >
          {selectedStockData ? (
            <span className="truncate">
              {selectedStockData.code} - {selectedStockData.name}
            </span>
          ) : (
            "请选择一只股票"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-md">
            {/* 搜索框 */}
            <div className="flex items-center border-b px-3 py-2">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                ref={inputRef}
                placeholder="搜索股票..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            </div>

            {/* 股票列表 */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredStocks.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {searchTerm ? "未找到相关股票" : "暂无股票数据"}
                </div>
              ) : (
                filteredStocks.map((stock, index) => (
                  <div
                    key={stock.code}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                      // 高亮状态（键盘导航）
                      index === highlightedIndex && "bg-accent text-accent-foreground",
                      // 选中状态
                      selectedStock === stock.code && "bg-accent/50",
                      // 悬停状态
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                    onClick={() => handleStockSelect(stock.code)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selectedStock === stock.code ? "opacity-100" : "opacity-0")} />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate">{stock.code}</span>
                      <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
