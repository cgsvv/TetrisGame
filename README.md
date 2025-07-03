# 俄罗斯方块游戏

一个使用 React + TypeScript + Vite 构建的现代化俄罗斯方块游戏。

## 功能特性

- 🎮 经典的俄罗斯方块游戏玩法
- 🎨 现代化的UI设计，支持响应式布局
- ⌨️ 完整的键盘控制支持
- 📊 实时分数、等级和消除行数显示
- 🔄 下一个方块预览
- ⏸️ 游戏暂停/继续功能
- 🎯 等级系统，随等级提升速度加快
- 📱 移动设备友好

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式**: CSS Modules + CSS Variables
- **状态管理**: React Hooks (useReducer)
- **游戏引擎**: 自定义游戏循环

## 项目结构

```
src/
├── components/          # UI组件
│   ├── GameBoard.tsx    # 游戏主面板
│   ├── NextPiece.tsx    # 下一个方块预览
│   ├── ScoreBoard.tsx   # 分数面板
│   ├── Controls.tsx     # 控制说明
│   └── GameOver.tsx     # 游戏结束弹窗
├── hooks/              # 自定义Hooks
│   ├── useGameLoop.ts   # 游戏循环逻辑
│   ├── useKeyboard.ts   # 键盘事件处理
│   └── useGameState.ts  # 游戏状态管理
├── utils/              # 工具函数
│   ├── tetrominos.ts    # 方块定义和旋转逻辑
│   ├── gameLogic.ts     # 游戏核心逻辑
│   └── constants.ts     # 游戏常量
├── types/              # TypeScript类型定义
│   └── game.ts         # 游戏相关类型
├── styles/             # 样式文件
│   ├── GameBoard.module.css
│   └── global.css
├── App.tsx
└── main.tsx
```

## 游戏控制

- **Enter**: 开始游戏
- **P / Esc**: 暂停/继续游戏
- **← / A**: 左移方块
- **→ / D**: 右移方块
- **↓ / S**: 下移方块
- **↑ / W**: 旋转方块
- **空格**: 硬下落

## 分数系统

- 消除1行: 100 × (等级 + 1) 分
- 消除2行: 300 × (等级 + 1) 分
- 消除3行: 500 × (等级 + 1) 分
- 消除4行: 800 × (等级 + 1) 分
- 硬下落: 每格2分

## 等级系统

- 每消除10行升一级
- 等级越高，方块下落速度越快
- 最高等级: 20级

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 代码特点

### 可维护性
- **模块化设计**: 清晰的职责分离，UI组件与游戏逻辑分离
- **TypeScript**: 完整的类型安全保证
- **自定义Hooks**: 逻辑复用和状态管理
- **纯函数**: 游戏逻辑函数易于测试和维护

### 性能优化
- **React.memo**: 组件性能优化
- **useCallback**: 避免不必要的重新渲染
- **requestAnimationFrame**: 流畅的游戏循环
- **CSS Modules**: 样式隔离和优化

### 用户体验
- **响应式设计**: 支持各种屏幕尺寸
- **键盘控制**: 完整的键盘支持
- **视觉反馈**: 动画和状态提示
- **无障碍设计**: 清晰的视觉层次

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License 