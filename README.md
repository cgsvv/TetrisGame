# 俄罗斯方块游戏

一个使用 React + TypeScript + Vite 构建的现代俄罗斯方块游戏。

## 功能特性

- 🎮 经典俄罗斯方块玩法
- 🎨 现代化 UI 设计
- 🤖 AI 助手模式（支持多个难度等级）
- ⚡ 可调节游戏速度
- 🏆 在线排行榜系统
- 🔊 音效支持
- 📱 响应式设计

## 音效文件

游戏支持音效功能，请将以下音效文件放置在 `public/sounds/` 目录下：

- `move.wav` - 方块移动音效
- `rotate.wav` - 方块旋转音效
- `drop.wav` - 硬下落音效
- `land.wav` - 方块落地音效
- `clear.wav` - 消行音效
- `start.wav` - 游戏开始音效
- `pause.wav` - 游戏暂停音效
- `resume.wav` - 游戏恢复音效
- `gameover.wav` - 游戏结束音效

音效文件格式建议使用 WAV 格式，采样率 44.1kHz，时长控制在 0.5-2 秒之间。

## 安装和运行

1. 克隆项目
```bash
git clone <repository-url>
cd ChessGame
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 配置：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 启动开发服务器
```bash
npm run dev
```

5. 打开浏览器访问 `http://localhost:5173`

## 游戏控制

- **方向键**：移动方块
- **空格键**：旋转方块
- **回车键**：硬下落
- **P 键**：暂停/恢复游戏
- **R 键**：重新开始游戏

## 技术栈

- **前端框架**：React 18
- **开发语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：React Hooks + useReducer
- **样式**：CSS Modules
- **后端服务**：Supabase
- **路由**：React Router
- **数据获取**：React Query

## 项目结构

```
src/
├── components/          # React 组件
├── hooks/              # 自定义 Hooks
├── lib/                # 第三方库配置
├── pages/              # 页面组件
├── styles/             # 样式文件
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
└── App.tsx             # 主应用组件
```

## 部署

项目可以部署到任何支持静态文件托管的平台：

- Vercel
- Netlify
- GitHub Pages
- 阿里云 OSS
- 腾讯云 COS

## 许可证

MIT License 