import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "tetris": "Tetris",
      "nextPiece": "Next Piece",
      "gameInfo": "Game Info",
      "score": "Score",
      "level": "Level",
      "lines": "Lines",
      "controls": "Controls",
      "startGame": "Start Game",
      "pauseResume": "Pause/Resume",
      "moveLeft": "Left",
      "moveRight": "Right",
      "moveDown": "Down",
      "rotate": "Rotate",
      "hardDrop": "Hard Drop",
      "space": "Space",
      "advancedOptions": "Advanced Options",
      "soundOn": "Sound On",
      "soundOff": "Sound Off",
      "aiAssistant": "AI Assistant",
      "speedControl": "Speed Control",
      "leaderboard": "Leaderboard",
      "username": "Username",
      "submitScore": "Submit Score",
      "close": "Close",
      "gameOver": "Game Over",
      "restart": "Restart",
      "finalScore": "Final Score",
      "levelReached": "Level Reached",
      "classicGameModernExperience": "Classic Game, Modern Experience",
      "useArrowKeysToMoveAndRotate": "Use arrow keys to move and rotate pieces",
      "builtWithReactTypeScriptVite": "Built with React + TypeScript + Vite",
      "keyboardControls": "Keyboard: Arrow keys to move, Space to rotate, Enter for hard drop",
      "pressEnterToStart": "Press Enter to start",
      "gameInProgress": "Game in progress",
      "pausedPressPToResume": "Paused - Press P to resume",
      "actualDropSpeed": "Actual Drop Speed",
      "difficulty": "Difficulty",
      "normal": "Normal",
      "easy": "Easy",
      "hard": "Hard",
      "aiThinking": "AI thinking...",
      "game": "Game",
      "loading": "Loading...",
      "loadFailed": "Failed to load",
      "retry": "Retry",
      "noData": "No data",
      "pleaseEnterUsername": "Please enter username",
      "submissionFailedPleaseRetry": "Submission failed, please try again",
      "scoreDoesntBeatRecord": "Your score doesn't beat your existing record",
      "currentBestScore": "Current best score",
      "submitting": "Submitting...",
      "pageTitle": {
        "home": "Tetris Game - Classic Tetris with AI Assistant & Online Leaderboard",
        "leaderboard": "Leaderboard - Tetris Game High Scores",
        "default": "Tetris Game"
      },
      "pageDescription": {
        "home": "Play the classic Tetris game with modern features: AI assistant, adjustable speed, online leaderboard, sound effects, and responsive design.",
        "leaderboard": "View the top scores and rankings for the Tetris game. Compete with players worldwide and see who has the highest score.",
        "default": "Play the classic Tetris game with modern features."
      }
    }
  },
  zh: {
    translation: {
      "tetris": "俄罗斯方块",
      "nextPiece": "下一个方块",
      "gameInfo": "游戏信息",
      "score": "分数",
      "level": "等级",
      "lines": "消除行数",
      "controls": "控制说明",
      "startGame": "开始游戏",
      "pauseResume": "暂停/继续",
      "moveLeft": "左移",
      "moveRight": "右移",
      "moveDown": "下移",
      "rotate": "旋转",
      "hardDrop": "硬下落",
      "space": "空格",
      "advancedOptions": "高级选项",
      "soundOn": "音效已开启",
      "soundOff": "音效已关闭",
      "aiAssistant": "AI助手",
      "speedControl": "速度控制",
      "leaderboard": "排行榜",
      "username": "用户名",
      "submitScore": "提交分数",
      "close": "关闭",
      "gameOver": "游戏结束",
      "restart": "重新开始",
      "finalScore": "最终分数",
      "levelReached": "达到等级",
      "classicGameModernExperience": "经典游戏，现代体验",
      "useArrowKeysToMoveAndRotate": "使用方向键控制方块移动和旋转",
      "builtWithReactTypeScriptVite": "使用 React + TypeScript + Vite 构建",
      "keyboardControls": "支持键盘控制：方向键移动，空格键旋转，回车键硬下落",
      "pressEnterToStart": "按 Enter 开始游戏",
      "gameInProgress": "游戏进行中",
      "pausedPressPToResume": "游戏暂停 - 按 P 继续",
      "actualDropSpeed": "实际下落速度",
      "difficulty": "难度",
      "normal": "普通",
      "easy": "简单",
      "hard": "困难",
      "aiThinking": "AI思考中...",
      "game": "游戏",
      "loading": "加载中...",
      "loadFailed": "加载失败",
      "retry": "重试",
      "noData": "暂无数据",
      "pleaseEnterUsername": "请输入用户名",
      "submissionFailedPleaseRetry": "提交失败，请重试",
      "scoreDoesntBeatRecord": "你的分数没有超过现有记录",
      "currentBestScore": "现有最高分",
      "submitting": "提交中...",
      "pageTitle": {
        "home": "俄罗斯方块游戏 - 经典俄罗斯方块与AI助手和在线排行榜",
        "leaderboard": "排行榜 - 俄罗斯方块游戏高分榜",
        "default": "俄罗斯方块游戏"
      },
      "pageDescription": {
        "home": "体验经典俄罗斯方块游戏，具备现代功能：AI助手、可调节速度、在线排行榜、音效和响应式设计。",
        "leaderboard": "查看俄罗斯方块游戏的最高分和排名。与全球玩家竞争，看看谁获得最高分。",
        "default": "体验经典俄罗斯方块游戏的现代功能。"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n; 