"use client"

import type { CalculationInputs } from "@/types/stock"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ParameterInputsProps {
  inputs: CalculationInputs
  onInputsChange: (inputs: CalculationInputs) => void
}

export function ParameterInputs({ inputs, onInputsChange }: ParameterInputsProps) {
  const handleGrowthRateChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 1
    onInputsChange({
      ...inputs,
      growthRate: numValue,
    })
  }

  const handleTargetDividendRateChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0.05
    onInputsChange({
      ...inputs,
      targetDividendRate: numValue / 100, // 转换为小数
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="growthRate">预估未来净利润增长系数</Label>
        <Input
          id="growthRate"
          type="number"
          step="0.01"
          min="0.5"
          max="3"
          value={inputs.growthRate}
          onChange={(e) => handleGrowthRateChange(e.target.value)}
          placeholder="例如：1.05 表示增长5%"
        />
        <p className="text-xs text-muted-foreground">1.0 = 无增长，1.05 = 增长5%，1.10 = 增长10%</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetDividendRate">目标股息率 (%)</Label>
        <Input
          id="targetDividendRate"
          type="number"
          step="0.1"
          min="1"
          max="20"
          value={(inputs.targetDividendRate * 100).toFixed(1)}
          onChange={(e) => handleTargetDividendRateChange(e.target.value)}
          placeholder="例如：5.0 表示5%"
        />
        <p className="text-xs text-muted-foreground">期望的年化股息收益率</p>
      </div>
    </div>
  )
}
