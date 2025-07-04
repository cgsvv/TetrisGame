import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "俄罗斯方块": "Tetris",
      "下一个方块": "Next Piece",
      "游戏信息": "Game Info",
      "分数": "Score",
      "等级": "Level",
      "消除行数": "Lines",
      "控制说明": "Controls",
      "开始游戏": "Start Game",
      "暂停/继续": "Pause/Resume",
      "左移": "Left",
      "右移": "Right",
      "下移": "Down",
      "旋转": "Rotate",
      "硬下落": "Hard Drop",
      "高级选项": "Advanced Options",
      "音效已开启": "Sound On",
      "音效已关闭": "Sound Off",
      "AI助手": "AI Assistant",
      "速度控制": "Speed Control",
      "排行榜": "Leaderboard",
      "用户名": "Username",
      "提交分数": "Submit Score",
      "关闭": "Close",
      "游戏结束": "Game Over",
      "重新开始": "Restart",
      "经典游戏，现代体验": "Classic Game, Modern Experience",
      "使用方向键控制方块移动和旋转": "Use arrow keys to move and rotate pieces",
      "使用 React + TypeScript + Vite 构建": "Built with React + TypeScript + Vite",
      "支持键盘控制：方向键移动，空格键旋转，回车键硬下落": "Keyboard: Arrow keys to move, Space to rotate, Enter for hard drop",
      "按 Enter 开始游戏": "Press Enter to start",
      "游戏进行中": "Game in progress",
      "游戏暂停 - 按 P 继续": "Paused - Press P to resume",
      "实际下落速度": "Actual Drop Speed",
      "难度": "Difficulty",
      "普通": "Normal",
      "简单": "Easy",
      "困难": "Hard",
      "AI思考中...": "AI thinking...",
      "游戏": "Game",
      "加载中...": "Loading...",
      "加载失败": "Failed to load",
      "重试": "Retry",
      "暂无数据": "No data",
      // ... 其他文案
    }
  },
  zh: {
    translation: {
      "俄罗斯方块": "俄罗斯方块",
      "下一个方块": "下一个方块",
      "游戏信息": "游戏信息",
      "分数": "分数",
      "等级": "等级",
      "消除行数": "消除行数",
      "控制说明": "控制说明",
      "开始游戏": "开始游戏",
      "暂停/继续": "暂停/继续",
      "左移": "左移",
      "右移": "右移",
      "下移": "下移",
      "旋转": "旋转",
      "硬下落": "硬下落",
      "高级选项": "高级选项",
      "音效已开启": "音效已开启",
      "音效已关闭": "音效已关闭",
      "AI助手": "AI助手",
      "速度控制": "速度控制",
      "排行榜": "排行榜",
      "用户名": "用户名",
      "提交分数": "提交分数",
      "关闭": "关闭",
      "游戏结束": "游戏结束",
      "重新开始": "重新开始",
      "经典游戏，现代体验": "经典游戏，现代体验",
      "使用方向键控制方块移动和旋转": "使用方向键控制方块移动和旋转",
      "使用 React + TypeScript + Vite 构建": "使用 React + TypeScript + Vite 构建",
      "支持键盘控制：方向键移动，空格键旋转，回车键硬下落": "支持键盘控制：方向键移动，空格键旋转，回车键硬下落",
      "按 Enter 开始游戏": "按 Enter 开始游戏",
      "游戏进行中": "游戏进行中",
      "游戏暂停 - 按 P 继续": "游戏暂停 - 按 P 继续",
      "实际下落速度": "实际下落速度",
      "难度": "难度",
      "普通": "普通",
      "简单": "简单",
      "困难": "困难",
      "AI思考中...": "AI思考中...",
      "游戏": "游戏",
      "加载中...": "加载中...",
      "加载失败": "加载失败",
      "重试": "重试",
      "暂无数据": "暂无数据",
      // ... 其他文案
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'zh',
    fallbackLng: 'zh',
    interpolation: { escapeValue: false }
  });

export default i18n; 