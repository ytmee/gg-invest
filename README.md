# 龟龟投资法计算器

*基于龟龟投资法理念的A股投资分析工具*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tianyangtys-projects/v0-next-js-community-starter)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/eiPZ2uT7eec)

## 项目简介

龟龟投资法计算器是一个基于B站UP主"史诗级韭菜"的龟龟投资法系列视频制作的纯前端投资分析工具。该工具专注于A股上市公司的股息投资分析，通过科学的计算公式帮助投资者评估股票的投资价值。

### 🚧 项目限制与说明

**数据获取限制**：
- 由于没有找到合适的免费API接口获取公司的最低股息支付率、注销式回购等关键信息
- 目前采用**手动维护**的方式更新股票数据
- **不考虑全量抓取**所有A股股票，专注于有长期投资价值的优质公司

**数据更新策略**：
- 当前股价、市值等基础信息需要手动更新
- 后续计划开发自动更新功能，方便与计算结果进行实时比较
- 欢迎社区用户推荐有跟踪价值的公司，我们会考虑纳入工具数据库

## 核心功能

### 📊 股票信息

- ✅ **股票信息展示**：显示公司基本信息，包括股价、市值、净利润等关键数据
- ✅ **参数调整**：可自定义净利润增长系数和目标股息率
- ✅ **智能计算**：自动计算预估综合收益率和可接受价格
- ✅ **价格分析**：直观显示当前股价是否被低估或高估
- ✅ **响应式设计**：支持桌面端和移动端访问
- ✅ **深色模式**：支持明暗主题切换
- ✅ **评论系统**：基于GitHub的讨论功能

### 🧮 计算公式

#### 预估综合收益率

\`\`\`
预估综合收益率 = (去年净利润 × 增长系数 × 股息支付率 + 注销式回购) ÷ 总市值
\`\`\`

#### 可接受价格

\`\`\`
可接受价格 = (去年净利润 × 增长系数 × 股息支付率 + 注销式回购) ÷ 目标股息率 ÷ 总股本
\`\`\`

## 📋 开发计划 (TODO List)

### ✅ 已完成功能

- [x] 基础计算功能实现
- [x] 股票选择和参数调整界面
- [x] 响应式布局设计
- [x] 深色模式支持
- [x] 投资理念视频嵌入
- [x] GitHub评论系统集成
- [x] 可折叠评论区
- [x] 注销式回购参数支持
- [x] 田字格布局优化

### 🚀 待完成功能

- [ ] **定时更新股价信息**：开发自动更新机制，定期获取最新股价和市值数据
- [ ] **数据源接口集成**：寻找并集成可靠的股票数据API
- [ ] **历史数据追踪**：记录股价变化历史，提供趋势分析
- [ ] **更多股票支持**：扩充数据库，添加更多优质公司
- [ ] **数据导出功能**：支持计算结果导出为Excel或PDF
- [ ] **投资组合分析**：支持多只股票的组合分析
- [ ] **风险评估指标**：添加更多风险评估维度
- [ ] **用户偏好设置**：保存用户的个性化设置

### 💡 功能建议

如果您有以下建议，欢迎通过评论区或GitHub Issues提出：
- 推荐值得跟踪的优质公司
- 数据源API推荐
- 新功能需求
- 界面优化建议

## 数据结构

### 股票数据字段

\`\`\`typescript
interface StockData {
  code: string                    // 股票代码
  name: string                    // 公司名称
  lastYearNetProfit: number       // 去年净利润（亿元）
  minDividendPayoutRatio: number  // 最低股息支付率（0-1）
  defaultGrowthRate: number       // 默认增长系数
  currentMarketCap: number        // 当前总市值（亿元）
  totalShares: number             // 总股本（亿股）
  currentPrice: number            // 当前股价（元）
  defaultTargetDividendRate: number // 默认目标股息率（0-1）
  cancellationBuyback: number     // 注销式回购（亿元）
  lastUpdated: string             // 最后更新时间
}
\`\`\`

## 项目结构

\`\`\`
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ui/               # shadcn/ui组件
│   ├── calculation-results.tsx
│   ├── parameter-inputs.tsx
│   ├── stock-info.tsx
│   ├── stock-selector.tsx
│   ├── giscus-comments.tsx
│   └── theme-toggle.tsx
├── data/                 # 数据文件
│   └── stocks.json       # 股票数据
├── types/                # TypeScript类型定义
│   └── stock.ts
├── utils/                # 工具函数
│   └── calculations.ts   # 计算逻辑
└── lib/                  # 库文件
    └── utils.ts
\`\`\`

## 本地开发

### 环境要求

- Node.js 18+
- npm/yarn/pnpm

### 安装依赖

\`\`\`bash
npm install
# 或
yarn install
# 或
pnpm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

\`\`\`bash
npm run build
# 或
yarn build
# 或
pnpm build
\`\`\`

## 数据维护

### 当前数据维护方式

股票数据存储在 `data/stocks.json` 文件中，包含以下信息：
- 公司基本信息（代码、名称）
- 财务数据（净利润、市值、股本等）
- 股息政策（支付率、回购金额）
- 默认参数设置

### 添加新股票

在 `data/stocks.json` 的 `stocks` 数组中添加新的股票对象：

\`\`\`json
{
  "code": "000001.SZ",
  "name": "平安银行",
  "lastYearNetProfit": 400.5,
  "minDividendPayoutRatio": 0.3,
  "defaultGrowthRate": 1.0,
  "currentMarketCap": 2500,
  "totalShares": 19.4,
  "currentPrice": 12.85,
  "defaultTargetDividendRate": 0.05,
  "cancellationBuyback": 20.0,
  "lastUpdated": "2024-01-15"
}
\`\`\`

### 推荐股票标准

我们欢迎社区推荐符合以下标准的公司：

1. **稳定分红**：连续多年保持稳定或递增的股息分红
2. **财务健康**：负债率合理，现金流稳定
3. **行业地位**：在细分领域具有竞争优势
4. **长期价值**：具备长期投资价值的优质企业
5. **信息透明**：定期披露详细的财务信息

## 技术栈

- **框架**：Next.js 15 (App Router)
- **UI库**：shadcn/ui + Tailwind CSS
- **主题**：next-themes
- **评论系统**：Giscus (GitHub Discussions)
- **部署**：Vercel
- **开发工具**：TypeScript, ESLint

## 贡献指南

### 如何贡献

1. **数据贡献**：推荐优质股票或更新现有数据
2. **功能开发**：提交新功能或改进现有功能
3. **问题反馈**：报告bug或提出改进建议
4. **文档完善**：改进文档或添加使用说明

### 提交方式

- 通过网站评论区讨论
- 提交GitHub Issues
- 发起Pull Request

## 免责声明

⚠️ **重要提示**：
- 本工具仅供投资参考，不构成投资建议
- 投资有风险，入市需谨慎
- 数据来源于公开信息，请以官方公告为准
- 计算结果基于历史数据和假设，实际情况可能存在差异
- 由于数据更新限制，请在使用前核实最新的公司财务信息

## 相关链接

- **投资理念来源**：[史诗级韭菜 - B站主页](https://space.bilibili.com/322005137)
- **龟龟投资法视频**：[点击观看](https://www.bilibili.com/video/BV1EDJWzNEXn)
- **项目讨论**：网站内置评论区
- **源码仓库**：[GitHub Repository](https://github.com/ytmee/gg-invest)

## 许可证

本项目仅供学习和参考使用。数据仅供参考，投资决策请基于官方信息。

---

*最后更新：2024年12月*
\`\`\`

同时更新主页面，在项目标题下方添加简短的限制说明：
