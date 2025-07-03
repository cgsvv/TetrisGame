import { TetrominoType } from '../types/game';

// 游戏板尺寸
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// 方块颜色映射
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00bcd4', // 深青色
  O: '#ffc107', // 深黄色
  T: '#9c27b0', // 深紫色
  S: '#4caf50', // 深绿色
  Z: '#f44336', // 深红色
  J: '#2196f3', // 深蓝色
  L: '#ff9800', // 深橙色
};

// 游戏速度配置
export const SPEED_CONFIG = {
  INITIAL_DROP_SPEED: 1000, // 初始下落速度 (ms)
  SPEED_INCREASE: 50,       // 每级增加的速度 (ms)
  MIN_DROP_SPEED: 100,      // 最小下落速度 (ms)
};

// 分数配置
export const SCORE_CONFIG = {
  SINGLE_LINE: 100,    // 消除1行
  DOUBLE_LINES: 300,   // 消除2行
  TRIPLE_LINES: 500,   // 消除3行
  TETRIS: 800,         // 消除4行
  SOFT_DROP: 1,        // 软下落每格
  HARD_DROP: 2,        // 硬下落每格
};

// 等级配置
export const LEVEL_CONFIG = {
  LINES_PER_LEVEL: 10, // 每消除10行升一级
  MAX_LEVEL: 20,       // 最大等级
};

// 键盘按键映射
export const KEY_MAPPING = {
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
  DOWN: ['ArrowDown', 's', 'S'],
  ROTATE: ['ArrowUp', 'w', 'W'], // 移除空格键
  DROP: [' '], // 空格键硬下落
  PAUSE: ['p', 'P', 'Escape'],
  START: ['Enter'],
}; 