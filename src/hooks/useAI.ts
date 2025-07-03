import { useCallback, useRef } from 'react';
import { CurrentPiece, TetrominoType, AILevel, AIDecision } from '../types/game';
import { makeAIDecision, simulateAIThinking } from '../utils/aiLogic';

interface UseAIProps {
  board: number[][];
  currentPiece: CurrentPiece | null;
  nextPiece: TetrominoType;
  aiMode: boolean;
  aiLevel: AILevel;
  aiThinking: boolean;
  onMovePiece: (direction: 'left' | 'right' | 'down') => void;
  onRotatePiece: () => void;
  onDropPiece: () => void;
  onSetAIThinking: (thinking: boolean) => void;
}

export const useAI = ({
  board,
  currentPiece,
  nextPiece,
  aiMode,
  aiLevel,
  aiThinking,
  onMovePiece,
  onRotatePiece,
  onDropPiece,
  onSetAIThinking,
}: UseAIProps) => {
  const isExecutingRef = useRef(false);

  // 执行AI动作序列
  const executeAIActions = useCallback(async (actions: number[]) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    for (const action of actions) {
      if (!aiMode) break; // 如果AI模式被关闭，停止执行

      switch (action) {
        case 0: // 左移
          onMovePiece('left');
          break;
        case 1: // 右移
          onMovePiece('right');
          break;
        case 2: // 下移
          onMovePiece('down');
          break;
        case 3: // 旋转
          onRotatePiece();
          break;
        case 4: // 硬下落
          onDropPiece();
          break;
      }

      // 添加操作延迟，模拟人类操作
      const delay = 50 + Math.random() * 100; // 50-150ms
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    isExecutingRef.current = false;
  }, [aiMode, onMovePiece, onRotatePiece, onDropPiece]);

  // 生成AI动作序列
  const generateAIActions = useCallback((
    currentPiece: CurrentPiece,
    targetDecision: AIDecision
  ): number[] => {
    const actions: number[] = [];
    const { position: targetPos, shape: targetShape } = targetDecision;
    const { position: currentPos, shape: currentShape } = currentPiece;

    // 如果形状不同，需要旋转
    if (JSON.stringify(currentShape) !== JSON.stringify(targetShape)) {
      actions.push(3); // 旋转
    }

    // 移动到目标X位置
    const xDiff = targetPos.x - currentPos.x;
    if (xDiff > 0) {
      for (let i = 0; i < xDiff; i++) {
        actions.push(1); // 右移
      }
    } else if (xDiff < 0) {
      for (let i = 0; i < Math.abs(xDiff); i++) {
        actions.push(0); // 左移
      }
    }

    // 硬下落到底部
    actions.push(4); // 硬下落

    return actions;
  }, []);

  // AI决策和执行
  const makeAIDecisionAndExecute = useCallback(async () => {
    if (!aiMode || !currentPiece || aiThinking || isExecutingRef.current) {
      return;
    }

    try {
      onSetAIThinking(true);

      // 模拟AI思考时间
      await simulateAIThinking(aiLevel);

      // 生成AI决策
      const decision = makeAIDecision(board, currentPiece, aiLevel);

      // 生成动作序列
      const actions = generateAIActions(currentPiece, decision);

      // 执行动作序列
      await executeAIActions(actions);

    } catch (error) {
      console.error('AI决策执行错误:', error);
    } finally {
      onSetAIThinking(false);
    }
  }, [
    aiMode,
    currentPiece,
    board,
    nextPiece,
    aiLevel,
    aiThinking,
    onSetAIThinking,
    generateAIActions,
    executeAIActions,
  ]);

  return {
    makeAIDecisionAndExecute,
  };
}; 