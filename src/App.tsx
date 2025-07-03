import { useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { GameOver } from './components/GameOver';
import { SpeedControl } from './components/SpeedControl';
import { AIControl } from './components/AIControl';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useAI } from './hooks/useAI';
import './styles/global.css';

function App() {
  const {
    state,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    movePiece,
    rotatePiece,
    dropPiece,
    updateGame,
    setManualSpeed,
    toggleAIMode,
    setAILevel,
    setAIThinking,
  } = useGameState();

  const { makeAIDecisionAndExecute } = useAI({
    board: state.board,
    currentPiece: state.currentPiece,
    nextPiece: state.nextPiece,
    aiMode: state.aiMode,
    aiLevel: state.aiLevel,
    aiThinking: state.aiThinking,
    onMovePiece: movePiece,
    onRotatePiece: rotatePiece,
    onDropPiece: dropPiece,
    onSetAIThinking: setAIThinking,
  });

  // 游戏循环
  useGameLoop({
    status: state.status,
    onUpdate: updateGame,
    dropSpeed: state.dropSpeed,
  });

  // 键盘控制
  useKeyboard({
    status: state.status,
    onMoveLeft: () => movePiece('left'),
    onMoveRight: () => movePiece('right'),
    onMoveDown: () => movePiece('down'),
    onRotate: rotatePiece,
    onDrop: dropPiece,
    onPause: state.status === 'playing' ? pauseGame : resumeGame,
    onStart: startGame,
  });

  // AI决策执行
  useEffect(() => {
    if (state.aiMode && state.status === 'playing' && state.currentPiece && !state.aiThinking) {
      const timer = setTimeout(() => {
        makeAIDecisionAndExecute();
      }, 500); // 延迟500ms后开始AI决策

      return () => clearTimeout(timer);
    }
  }, [state.aiMode, state.status, state.currentPiece, state.aiThinking, makeAIDecisionAndExecute]);

  return (
    <div className="app-root">
      <header className="header">
        <h1>俄罗斯方块</h1>
        <p>经典游戏，现代体验</p>
      </header>

      <main className="main-layout">
        <div className="game-flex">
          <div className="game-area">
            <GameBoard gameState={state} />
          </div>
          <aside className="side-panel">
            <NextPiece nextPiece={state.nextPiece} />
            <ScoreBoard gameState={state} />
            <SpeedControl 
              currentSpeed={state.manualSpeed}
              onSpeedChange={setManualSpeed}
              actualDropSpeed={state.dropSpeed}
            />
            <AIControl
              aiMode={state.aiMode}
              aiLevel={state.aiLevel}
              aiThinking={state.aiThinking}
              onToggleAIMode={toggleAIMode}
              onSetAILevel={setAILevel}
            />
          </aside>
        </div>
        <div className="controls-bar">
          <Controls />
        </div>
        {state.status === 'gameOver' && (
          <GameOver 
            gameState={state} 
            onRestart={resetGame} 
          />
        )}
      </main>

      <footer className="footer">
        <p>使用 React + TypeScript + Vite 构建</p>
        <p>支持键盘控制：方向键移动，空格键旋转，回车键硬下落</p>
      </footer>
    </div>
  );
}

export default App; 