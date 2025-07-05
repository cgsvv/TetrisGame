# 俄罗斯方块游戏 SEO 指南

[English Version](../en/SEO_GUIDE.md)

## 概述

本文档概述了为俄罗斯方块游戏网站实施的 SEO 优化，以提高搜索引擎可见性和用户体验。

## 已实施的 SEO 功能

### 1. Meta 标签和 HTML 结构

#### 主要 Meta 标签
- **标题**: 每个页面的动态、SEO 优化标题
- **描述**: 每个路由的唯一、引人注目的描述
- **关键词**: 与俄罗斯方块和游戏相关的关键词
- **语言**: 支持国际化的正确语言属性
- **机器人**: 正确的索引指令

#### Open Graph 标签
- **og:title**: 针对社交媒体分享优化
- **og:description**: 社交平台的吸引人描述
- **og:image**: 社交媒体预览图片
- **og:type**: 网站类型规范
- **og:locale**: 语言/地区信息

#### Twitter 卡片标签
- **twitter:card**: 大图片卡片格式
- **twitter:title**: Twitter 特定标题
- **twitter:description**: Twitter 特定描述
- **twitter:image**: Twitter 预览图片

### 2. 结构化数据 (Schema.org)

#### WebApplication 模式
```json
{
  "@type": "WebApplication",
  "name": "俄罗斯方块游戏",
  "description": "带 AI 助手的现代俄罗斯方块游戏",
  "applicationCategory": "Game",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

#### Game 模式
```json
{
  "@type": "Game",
  "name": "俄罗斯方块游戏",
  "genre": "Puzzle",
  "gamePlatform": "Web Browser"
}
```

#### ItemList 模式 (排行榜)
```json
{
  "@type": "ItemList",
  "name": "排行榜",
  "numberOfItems": 20,
  "itemListElement": [...]
}
```

### 3. 技术 SEO

#### 网站地图
- **位置**: `/public/sitemap.xml`
- **覆盖范围**: 所有主要页面
- **更新频率**: 主页每周，排行榜每日

#### Robots.txt
- **位置**: `/public/robots.txt`
- **指令**: 允许所有内容，禁止管理区域
- **网站地图引用**: 指向 sitemap.xml

#### PWA 支持
- **清单**: `/public/manifest.json`
- **功能**: 类似应用的体验，离线功能
- **移动优化**: 响应式设计，触摸友好

### 4. 性能优化

#### 预连接
- Google Fonts 预连接
- 外部资源优化

#### 图片优化
- 适当的图片格式（图标使用 PNG）
- 响应式图片
- 可访问性的 Alt 文本

#### 加载策略
- 非关键资源的懒加载
- 使用 Vite 的高效包分割

### 5. 国际化 (i18n)

#### 语言支持
- **英语**: 默认语言
- **中文**: 完整翻译支持
- **动态语言切换**: 基于 URL 的语言检测

#### SEO 优势
- **hreflang**: 正确的语言定位
- **本地化内容**: 国家特定的优化
- **搜索引擎信号**: 清晰的语言指示器

### 6. 内容策略

#### 关键词
主要关键词：
- 俄罗斯方块
- 俄罗斯方块游戏
- 在线俄罗斯方块
- 经典俄罗斯方块
- 带 AI 的俄罗斯方块
- 俄罗斯方块排行榜
- React 俄罗斯方块
- TypeScript 俄罗斯方块
- 浏览器游戏
- 益智游戏

#### 内容类型
- **游戏功能**: AI 助手、速度控制、排行榜
- **技术栈**: React、TypeScript、Vite
- **用户体验**: 响应式设计、音效

### 7. 社交媒体优化

#### 分享优化
- **Facebook**: Open Graph 标签
- **Twitter**: Twitter 卡片标签
- **LinkedIn**: 专业分享格式

#### 视觉资产
- **OG 图片**: 推荐 1200x630px
- **Twitter 图片**: 推荐 1200x600px
- **截图**: 游戏预览图片

### 8. 域名配置

#### 当前域名
- **生产环境**: https://tetris-game-sooty.vercel.app
- **网站地图**: https://tetris-game-sooty.vercel.app/sitemap.xml
- **机器人协议**: https://tetris-game-sooty.vercel.app/robots.txt

## 实施细节

### 动态 Meta 标签
`usePageTitle` hook 根据以下内容动态更新 meta 标签：
- 当前路由
- 选择的语言
- 页面内容

### 结构化数据注入
`SEOStructuredData` 组件：
- 注入 JSON-LD 结构化数据
- 根据页面类型和内容更新
- 支持多种模式类型

### 语言检测
- 从 URL 自动检测语言
- 回退到用户偏好
- SEO 友好的 URL 结构

## 监控和分析

### 推荐工具
1. **Google Search Console**: 监控索引和性能
2. **Google Analytics**: 跟踪用户行为
3. **Lighthouse**: 性能审计
4. **Schema.org Validator**: 结构化数据验证

### 关键指标
- **核心网页指标**: LCP、FID、CLS
- **搜索排名**: 目标关键词位置
- **自然流量**: 搜索驱动的访问
- **用户参与度**: 网站停留时间、跳出率

## 未来增强

### 计划改进
1. **博客部分**: 游戏技巧和策略
2. **用户评论**: 社会证明和推荐
3. **视频内容**: 游戏演示
4. **社区功能**: 用户生成内容

### 技术升级
1. **Service Worker**: 离线功能
2. **AMP 支持**: 加速移动页面
3. **高级分析**: 自定义事件跟踪
4. **A/B 测试**: 性能优化

## 最佳实践

### 内容指南
- 编写独特、有价值的内容
- 使用自然的关键词放置
- 包含内部链接
- 定期内容更新

### 技术指南
- 快速加载时间（< 3 秒）
- 移动优先设计
- 安全的 HTTPS 连接
- 干净的 URL 结构

### 用户体验
- 直观的导航
- 快速游戏加载
- 响应式设计
- 可访问性合规

## 维护

### 定期任务
- **每月**: 审查搜索控制台数据
- **每季度**: 更新 meta 描述
- **每年**: 刷新内容和关键词

### 监控
- **每日**: 检查技术问题
- **每周**: 审查性能指标
- **每月**: 分析用户行为

这个 SEO 实施为搜索引擎可见性提供了坚实的基础，同时在所有设备和语言上保持出色的用户体验。 