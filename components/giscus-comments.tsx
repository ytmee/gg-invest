"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isExpanded || !ref.current || ref.current.hasChildNodes()) return

    setIsLoading(true)
    const scriptElem = document.createElement("script")
    scriptElem.src = "https://giscus.app/client.js"
    scriptElem.async = true
    scriptElem.crossOrigin = "anonymous"

    scriptElem.setAttribute("data-repo", "ytmee/gg-invest")
    scriptElem.setAttribute("data-repo-id", "R_kgDOO8j8vg")
    scriptElem.setAttribute("data-category", "General")
    scriptElem.setAttribute("data-category-id", "DIC_kwDOO8j8vs4CrnF9")
    scriptElem.setAttribute("data-mapping", "title")
    scriptElem.setAttribute("data-strict", "0")
    scriptElem.setAttribute("data-reactions-enabled", "0")
    scriptElem.setAttribute("data-emit-metadata", "0")
    scriptElem.setAttribute("data-input-position", "top")
    scriptElem.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    scriptElem.setAttribute("data-lang", "zh-CN")

    // 监听脚本加载完成
    scriptElem.onload = () => {
      setIsLoading(false)
    }

    ref.current.appendChild(scriptElem)
  }, [isExpanded, resolvedTheme])

  // 当主题变化时更新Giscus主题
  useEffect(() => {
    if (!isExpanded) return

    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: resolvedTheme === "dark" ? "dark" : "light",
            },
          },
        },
        "https://giscus.app",
      )
    }
  }, [resolvedTheme, isExpanded])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="w-full">
      {/* 展开/折叠按钮 */}
      <Button
        variant="outline"
        onClick={toggleExpanded}
        className="w-full mb-4 h-12 text-left justify-between hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium">讨论交流</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>需要GitHub账号登录后才能评论</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isExpanded && <span className="text-xs text-muted-foreground hidden sm:inline">点击展开评论区</span>}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </Button>

      {/* 评论区内容 */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border rounded-lg bg-card">
          {isExpanded && (
            <>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">正在加载评论区...</span>
                  </div>
                </div>
              )}

              {/* 评论区容器 - 设置最大高度和滚动 */}
              <div className="max-h-[800px] overflow-y-auto">
                <div ref={ref} className="giscus p-4" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
