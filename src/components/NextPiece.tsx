import React from 'react';
import { useTranslation } from 'react-i18next';
import { TetrominoType } from '../types/game';
import { TETROMINOS } from '../utils/tetrominos';
import { TETROMINO_COLORS } from '../utils/constants';

interface NextPieceProps {
  nextPiece: TetrominoType;
}

export const NextPiece: React.FC<NextPieceProps> = ({ nextPiece }) => {
  const { t } = useTranslation();
  const shape = TETROMINOS[nextPiece][0];
  const color = TETROMINO_COLORS[nextPiece];

  return (
    <div className="info-panel">
      <h3>{t('下一个方块')}</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${shape[0].length}, 20px)`,
        gridTemplateRows: `repeat(${shape.length}, 20px)`,
        gap: '1px',
        justifyContent: 'center',
        margin: '0 auto',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: cell !== 0 ? color : 'transparent',
                border: cell !== 0 ? '1px solid rgba(0, 0, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}; 