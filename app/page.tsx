"use client"

import { useState, useEffect } from "react"
import type { StockData, CalculationInputs } from "@/types/stock"
import { performCalculations } from "@/utils/calculations"
import { StockSelector } from "@/components/stock-selector"
import { ParameterInputs } from "@/components/parameter-inputs"
import { StockInfo } from "@/components/stock-info"
import { CalculationResultsComponent } from "@/components/calculation-results"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Video } from "lucide-react"
import stocksData from "@/data/stocks.json"

export default function HomePage() {
  const [stocks] = useState<StockData[]>(stocksData.stocks)
  const [selectedStockCode, setSelectedStockCode] = useState<string>(stocksData.stocks[0]?.code || "")
  const [inputs, setInputs] = useState<CalculationInputs>({
    growthRate: 1.05,
    targetDividendRate: 0.05,
  })

  // 当选择股票时，使用该股票的默认值
  useEffect(() => {
    if (selectedStockCode) {
      const stock = stocks.find((s) => s.code === selectedStockCode)
      if (stock) {
        setInputs({
          growthRate: stock.defaultGrowthRate,
          targetDividendRate: stock.defaultTargetDividendRate,
        })
      }
    }
  }, [selectedStockCode, stocks])

  const selectedStock = stocks.find((s) => s.code === selectedStockCode)
  const results = selectedStock ? performCalculations(selectedStock, inputs) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">龟龟投资法计算器</h1>
            <p className="text-muted-foreground mt-1">
              数据更新时间：{new Date(stocksData.lastUpdated).toLocaleDateString("zh-CN")}
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-6">
          {/* 上方行：选择股票(1/4) + 股票详情(3/4) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>选择股票</CardTitle>
                </CardHeader>
                <CardContent>
                  <StockSelector
                    stocks={stocks}
                    selectedStock={selectedStockCode}
                    onStockChange={setSelectedStockCode}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">{selectedStock && <StockInfo stock={selectedStock} />}</div>
          </div>

          {/* 下方行：调整参数(1/2) + 计算结果(1/2) */}
          {selectedStock && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>调整参数</CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterInputs inputs={inputs} onInputsChange={setInputs} />
                </CardContent>
              </Card>

              {results && <CalculationResultsComponent stock={selectedStock} results={results} />}
            </div>
          )}

          {!selectedStock && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">开始分析</h3>
                  <p className="text-muted-foreground">请选择一只股票开始分析</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 投资理念说明卡片 */}
        <Card className="mb-6 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Video className="h-5 w-5" />
              龟龟投资法理念
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              本网站基于B站UP主"史诗级韭菜"的龟龟投资法系列视频制作，仅供参考
            </p>

            {/* 嵌入式视频 */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src="//player.bilibili.com/player.html?isOutside=true&aid=114554142984441&bvid=BV1EDJWzNEXn&cid=30099900284&p=1&autoplay=0"
                scrolling="no"
                border="0"
                frameBorder="no"
                framespacing="0"
                allowFullScreen={true}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                title="龟龟投资法视频"
              />
            </div>

            <div className="flex items-center justify-center pt-2">
              <a
                href="https://space.bilibili.com/322005137"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                访问UP主页: 史诗级韭菜
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>本工具仅供参考，投资有风险，入市需谨慎。数据来源于公开信息，请以官方公告为准。</p>
        </div>
      </div>
    </div>
  )
}
