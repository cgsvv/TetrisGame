import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { GameOver } from './components/GameOver';
import { SpeedControl } from './components/SpeedControl';
import { AIControl } from './components/AIControl';
import { ScoreSubmission } from './components/ScoreSubmission';
import { Navigation } from './components/Navigation';
import { Leaderboard } from './pages/Leaderboard';
import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { useKeyboard } from './hooks/useKeyboard';
import { useAI } from './hooks/useAI';
import './styles/global.css';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 游戏页面组件
const GamePage: React.FC = () => {
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

  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);

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

  // 游戏结束时显示分数提交
  useEffect(() => {
    if (state.status === 'gameOver' && !hasSubmittedScore) {
      setShowScoreSubmission(true);
    }
  }, [state.status, hasSubmittedScore]);

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setHasSubmittedScore(true);
  };

  const handleScoreSubmissionClose = () => {
    setShowScoreSubmission(false);
    setHasSubmittedScore(true);
  };

  const handleGameRestart = () => {
    setHasSubmittedScore(false);
    resetGame();
  };

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
            onRestart={handleGameRestart} 
          />
        )}

        {showScoreSubmission && (
          <ScoreSubmission
            score={state.score}
            level={state.level}
            lines={state.lines}
            onClose={handleScoreSubmissionClose}
            onSubmitted={handleScoreSubmitted}
          />
        )}
      </main>

      <footer className="footer">
        <p>使用 React + TypeScript + Vite 构建</p>
        <p>支持键盘控制：方向键移动，空格键旋转，回车键硬下落</p>
      </footer>
    </div>
  );
};

// 主应用组件
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-wrapper">
          <Navigation />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<GamePage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 