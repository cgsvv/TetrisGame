import React from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { GameOver } from './components/GameOver';
import { SpeedControl } from './components/SpeedControl';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import './styles/global.css';

function App() {
  const { state, actions } = useGameState();

  // 游戏循环
  useGameLoop({
    status: state.status,
    onUpdate: actions.updateGame,
    dropSpeed: state.dropSpeed,
  });

  // 键盘控制
  useKeyboard({
    status: state.status,
    onMoveLeft: () => actions.movePiece('left'),
    onMoveRight: () => actions.movePiece('right'),
    onMoveDown: () => actions.movePiece('down'),
    onRotate: actions.rotatePiece,
    onDrop: actions.dropPiece,
    onPause: state.status === 'playing' ? actions.pauseGame : actions.resumeGame,
    onStart: actions.startGame,
  });

  return (
    <div className="game-container">
      <GameBoard gameState={state} />
      
      <div className="side-panel">
        <ScoreBoard gameState={state} />
        <NextPiece nextPiece={state.nextPiece} />
        <SpeedControl 
          currentSpeed={state.manualSpeed}
          onSpeedChange={actions.setManualSpeed}
          actualDropSpeed={state.dropSpeed}
        />
        <Controls />
      </div>
      
      {state.status === 'gameOver' && (
        <GameOver 
          gameState={state} 
          onRestart={actions.resetGame} 
        />
      )}
    </div>
  );
}

export default App; 