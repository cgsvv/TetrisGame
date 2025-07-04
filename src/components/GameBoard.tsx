import React from 'react';
import { GameState } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_COLORS } from '../utils/constants';
import styles from '../styles/GameBoard.module.css';

interface GameBoardProps {
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { board, currentPiece, status } = gameState;

  // 创建包含当前方块的完整游戏板
  const getFullBoard = (): (number | string)[][] => {
    const fullBoard = board.map(row => [...row]) as (number | string)[][];

    if (currentPiece) {
      const { shape, position, type } = currentPiece;
      
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col] !== 0) {
            const boardY = position.y + row;
            const boardX = position.x + col;
            
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              fullBoard[boardY][boardX] = type as string;
            }
          }
        }
      }
    }

    return fullBoard;
  };

  const fullBoard = getFullBoard();

  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return '按 Enter 开始游戏';
      case 'playing':
        return '游戏进行中';
      case 'paused':
        return '游戏暂停 - 按 P 继续';
      case 'gameOver':
        return '游戏结束';
      default:
        return '';
    }
  };

  const getCellStyle = (cellValue: number | string, row: number, col: number) => {
    const baseStyle = {
      backgroundColor: cellValue === 0 ? undefined : TETROMINO_COLORS[cellValue as keyof typeof TETROMINO_COLORS],
    };

    const isCurrentPiece = currentPiece && 
      row >= currentPiece.position.y && 
      row < currentPiece.position.y + currentPiece.shape.length &&
      col >= currentPiece.position.x && 
      col < currentPiece.position.x + currentPiece.shape[0].length &&
      currentPiece.shape[row - currentPiece.position.y]?.[col - currentPiece.position.x] !== 0;

    // 检查是否在消行动画中
    const isClearingLine = gameState.status === 'clearingLines' && 
      gameState.clearingLines.includes(row);

    let className = `${styles.cell} ${cellValue === 0 ? styles.empty : styles.filled}`;
    
    if (isCurrentPiece) {
      className += ` ${styles.current}`;
    }
    
    if (isClearingLine) {
      className += ` ${styles.clearing}`;
      // 根据动画步骤添加闪烁效果
      if (gameState.clearAnimationStep % 2 === 0) {
        className += ` ${styles.flash}`;
      }
    }

    return {
      ...baseStyle,
      className,
    };
  };

  return (
    <div className={styles.gameBoardContainer}>
      <div className={styles.gameStatus}>
        {getStatusText()}
      </div>
      
      <div className={styles.gameBoard}>
        {fullBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellStyle = getCellStyle(cell, rowIndex, colIndex);
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cellStyle.className}
                style={{ backgroundColor: cellStyle.backgroundColor }}
              />
            );
          })
        )}
      </div>
      
      {status === 'idle' && (
        <div className={styles.startPrompt}>
          使用方向键控制方块移动和旋转
        </div>
      )}
    </div>
  );
}; 