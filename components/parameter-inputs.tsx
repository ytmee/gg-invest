"use client"

import { useState, useEffect } from "react"
import type { CalculationInputs } from "@/types/stock"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlertCircle } from "lucide-react"

interface ParameterInputsProps {
  inputs: CalculationInputs
  onInputsChange: (inputs: CalculationInputs) => void
}

export function ParameterInputs({ inputs, onInputsChange }: ParameterInputsProps) {
  // 使用本地状态来管理输入框的显示值
  const [growthRateInput, setGrowthRateInput] = useState(inputs.growthRate.toString())
  const [targetDividendRateInput, setTargetDividendRateInput] = useState((inputs.targetDividendRate * 100).toFixed(1))

  // 范围警告状态
  const [growthRateWarning, setGrowthRateWarning] = useState("")
  const [dividendRateWarning, setDividendRateWarning] = useState("")

  // 定义范围常量
  const GROWTH_RATE_MIN = 0
  const GROWTH_RATE_MAX = 2
  const DIVIDEND_RATE_MIN = 1
  const DIVIDEND_RATE_MAX = 7

  // 当外部inputs变化时，更新本地显示值
  useEffect(() => {
    setGrowthRateInput(inputs.growthRate.toString())
    setTargetDividendRateInput((inputs.targetDividendRate * 100).toFixed(1))
  }, [inputs.growthRate, inputs.targetDividendRate])

  const handleGrowthRateInputChange = (value: string) => {
    setGrowthRateInput(value)
    setGrowthRateWarning("") // 清除警告

    // 实时更新父组件状态，范围与滑块一致：0-2
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      let clampedValue = numValue
      let warning = ""

      // 检查范围并限制到端点值
      if (numValue < GROWTH_RATE_MIN) {
        clampedValue = GROWTH_RATE_MIN
        warning = `数值已调整为最小值 ${GROWTH_RATE_MIN}，请输入 ${GROWTH_RATE_MIN}-${GROWTH_RATE_MAX} 范围内的数值`
      } else if (numValue > GROWTH_RATE_MAX) {
        clampedValue = GROWTH_RATE_MAX
        warning = `数值已调整为最大值 ${GROWTH_RATE_MAX}，请输入 ${GROWTH_RATE_MIN}-${GROWTH_RATE_MAX} 范围内的数值`
      }

      if (warning) {
        setGrowthRateWarning(warning)
        setGrowthRateInput(clampedValue.toString())
      }

      onInputsChange({
        ...inputs,
        growthRate: clampedValue,
      })
    }
  }

  const handleGrowthRateInputBlur = () => {
    // 失去焦点时，如果输入无效则恢复到当前有效值
    const numValue = Number.parseFloat(growthRateInput)
    if (isNaN(numValue)) {
      setGrowthRateInput(inputs.growthRate.toString())
      setGrowthRateWarning("")
    } else {
      // 确保格式化显示
      setGrowthRateInput(numValue.toString())
    }
  }

  const handleGrowthRateSliderChange = (values: number[]) => {
    const value = values[0]
    const formattedValue = Math.round(value * 100) / 100 // 保留两位小数
    setGrowthRateInput(formattedValue.toString())
    setGrowthRateWarning("") // 清除警告
    onInputsChange({
      ...inputs,
      growthRate: formattedValue,
    })
  }

  const handleTargetDividendRateInputChange = (value: string) => {
    setTargetDividendRateInput(value)
    setDividendRateWarning("") // 清除警告

    // 实时更新父组件状态，范围与滑块一致：1-7
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      let clampedValue = numValue
      let warning = ""

      // 检查范围并限制到端点值
      if (numValue < DIVIDEND_RATE_MIN) {
        clampedValue = DIVIDEND_RATE_MIN
        warning = `数值已调整为最小值 ${DIVIDEND_RATE_MIN}%，请输入 ${DIVIDEND_RATE_MIN}-${DIVIDEND_RATE_MAX}% 范围内的数值`
      } else if (numValue > DIVIDEND_RATE_MAX) {
        clampedValue = DIVIDEND_RATE_MAX
        warning = `数值已调整为最大值 ${DIVIDEND_RATE_MAX}%，请输入 ${DIVIDEND_RATE_MIN}-${DIVIDEND_RATE_MAX}% 范围内的数值`
      }

      if (warning) {
        setDividendRateWarning(warning)
        setTargetDividendRateInput(clampedValue.toFixed(1))
      }

      onInputsChange({
        ...inputs,
        targetDividendRate: clampedValue / 100,
      })
    }
  }

  const handleTargetDividendRateInputBlur = () => {
    // 失去焦点时，如果输入无效则恢复到当前有效值
    const numValue = Number.parseFloat(targetDividendRateInput)
    if (isNaN(numValue)) {
      setTargetDividendRateInput((inputs.targetDividendRate * 100).toFixed(1))
      setDividendRateWarning("")
    } else {
      // 确保格式化显示
      setTargetDividendRateInput(numValue.toFixed(1))
    }
  }

  const handleTargetDividendRateSliderChange = (values: number[]) => {
    const value = values[0]
    const formattedValue = Math.round(value * 10) / 10 // 保留一位小数
    setTargetDividendRateInput(formattedValue.toFixed(1))
    setDividendRateWarning("") // 清除警告
    onInputsChange({
      ...inputs,
      targetDividendRate: formattedValue / 100,
    })
  }

  return (
    <div className="space-y-6">
      {/* 净利润增长系数 */}
      <div className="space-y-3">
        <Label htmlFor="growthRate">预估未来净利润增长系数</Label>

        {/* 滑块 - 范围 0-2，1.0 居中 */}
        <div className="px-2">
          <Slider
            value={[inputs.growthRate]}
            onValueChange={handleGrowthRateSliderChange}
            max={GROWTH_RATE_MAX}
            min={GROWTH_RATE_MIN}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.0 (完全衰退)</span>
            <span>1.0 (无增长)</span>
            <span>2.0 (增长100%)</span>
          </div>
        </div>

        {/* 输入框 - 范围与滑块一致 0-2 */}
        <div className="flex items-center gap-2">
          <Input
            id="growthRate"
            type="number"
            step="0.01"
            min={GROWTH_RATE_MIN}
            max={GROWTH_RATE_MAX}
            value={growthRateInput}
            onChange={(e) => handleGrowthRateInputChange(e.target.value)}
            onBlur={handleGrowthRateInputBlur}
            placeholder="例如：1.05"
            className="flex-1"
          />
          <div className="text-sm text-muted-foreground min-w-fit">
            {(() => {
              const currentValue = inputs.growthRate
              if (Math.abs(currentValue - 1) < 0.01) {
                return "无增长"
              } else if (currentValue > 1) {
                return `增长${((currentValue - 1) * 100).toFixed(0)}%`
              } else {
                return `衰退${((1 - currentValue) * 100).toFixed(0)}%`
              }
            })()}
          </div>
        </div>

        {/* 范围警告 */}
        {growthRateWarning && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{growthRateWarning}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          范围：{GROWTH_RATE_MIN}-{GROWTH_RATE_MAX}倍。1.0 = 无增长，1.05 = 增长5%，0.9 = 衰退10%
        </p>
      </div>

      {/* 目标股息率 */}
      <div className="space-y-3">
        <Label htmlFor="targetDividendRate">目标股息率 (%)</Label>

        {/* 滑块 - 范围 1-7，4% 接近居中 */}
        <div className="px-2">
          <Slider
            value={[inputs.targetDividendRate * 100]}
            onValueChange={handleTargetDividendRateSliderChange}
            max={DIVIDEND_RATE_MAX}
            min={DIVIDEND_RATE_MIN}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1% (无风险收益)</span>
            <span>4% (合理要求)</span>
            <span>7% (高要求)</span>
          </div>
        </div>

        {/* 输入框 - 范围与滑块一致 1-7 */}
        <div className="flex items-center gap-2">
          <Input
            id="targetDividendRate"
            type="number"
            step="0.1"
            min={DIVIDEND_RATE_MIN}
            max={DIVIDEND_RATE_MAX}
            value={targetDividendRateInput}
            onChange={(e) => handleTargetDividendRateInputChange(e.target.value)}
            onBlur={handleTargetDividendRateInputBlur}
            placeholder="例如：4.0"
            className="flex-1"
          />
          <div className="text-sm text-muted-foreground min-w-fit">
            年化{(inputs.targetDividendRate * 100).toFixed(1)}%
          </div>
        </div>

        {/* 范围警告 */}
        {dividendRateWarning && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{dividendRateWarning}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          范围：{DIVIDEND_RATE_MIN}-{DIVIDEND_RATE_MAX}%。期望的年化股息收益率，数值越高要求越严格
        </p>
      </div>
    </div>
  )
}
