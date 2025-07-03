import React from 'react';
import { SPEED_CONFIG, SPEED_LEVELS } from '../utils/constants';

interface SpeedControlProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  actualDropSpeed?: number;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ currentSpeed, onSpeedChange, actualDropSpeed }) => {
  const speedPercentage = ((SPEED_CONFIG.MAX_DROP_SPEED - currentSpeed) / (SPEED_CONFIG.MAX_DROP_SPEED - SPEED_CONFIG.MIN_DROP_SPEED)) * 100;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    const speed = SPEED_CONFIG.MAX_DROP_SPEED - (value / 100) * (SPEED_CONFIG.MAX_DROP_SPEED - SPEED_CONFIG.MIN_DROP_SPEED);
    onSpeedChange(Math.round(speed));
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= SPEED_LEVELS.VERY_FAST) return '极快';
    if (speed <= SPEED_LEVELS.FAST) return '快速';
    if (speed <= SPEED_LEVELS.NORMAL) return '正常';
    return '慢速';
  };

  return (
    <div className="info-panel">
      <h3>速度控制</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          color: 'white',
          fontSize: '0.9em'
        }}>
          <span>手动: {getSpeedLabel(currentSpeed)}</span>
          <span>{currentSpeed}ms</span>
        </div>
        
        {actualDropSpeed && actualDropSpeed !== currentSpeed && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '8px',
            color: '#ffd700',
            fontSize: '0.8em'
          }}>
            <span>实际: {getSpeedLabel(actualDropSpeed)}</span>
            <span>{actualDropSpeed}ms</span>
          </div>
        )}
        
        <input
          type="range"
          min="0"
          max="100"
          value={speedPercentage}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'rgba(255, 255, 255, 0.2)',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button
          onClick={() => onSpeedChange(SPEED_LEVELS.SLOW)}
          style={{
            background: currentSpeed >= SPEED_LEVELS.SLOW ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
            color: currentSpeed >= SPEED_LEVELS.SLOW ? '#333' : 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '0.8em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          慢速
        </button>
        
        <button
          onClick={() => onSpeedChange(SPEED_LEVELS.NORMAL)}
          style={{
            background: currentSpeed >= SPEED_LEVELS.NORMAL && currentSpeed < SPEED_LEVELS.SLOW ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
            color: currentSpeed >= SPEED_LEVELS.NORMAL && currentSpeed < SPEED_LEVELS.SLOW ? '#333' : 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '0.8em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          正常
        </button>
        
        <button
          onClick={() => onSpeedChange(SPEED_LEVELS.FAST)}
          style={{
            background: currentSpeed >= SPEED_LEVELS.FAST && currentSpeed < SPEED_LEVELS.NORMAL ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
            color: currentSpeed >= SPEED_LEVELS.FAST && currentSpeed < SPEED_LEVELS.NORMAL ? '#333' : 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '0.8em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          快速
        </button>
        
        <button
          onClick={() => onSpeedChange(SPEED_LEVELS.VERY_FAST)}
          style={{
            background: currentSpeed < SPEED_LEVELS.FAST ? '#ffd700' : 'rgba(255, 255, 255, 0.2)',
            color: currentSpeed < SPEED_LEVELS.FAST ? '#333' : 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            fontSize: '0.8em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          极快
        </button>
      </div>
    </div>
  );
}; 