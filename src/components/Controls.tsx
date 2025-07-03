import React from 'react';
import { KEY_MAPPING } from '../utils/constants';

export const Controls: React.FC = () => {
  return (
    <div className="controls">
      <h3>控制说明</h3>
      <div className="control-item">
        <span>开始游戏:</span>
        <span className="control-key">Enter</span>
      </div>
      <div className="control-item">
        <span>暂停/继续:</span>
        <span className="control-key">P</span>
      </div>
      <div className="control-item">
        <span>左移:</span>
        <span className="control-key">←</span>
      </div>
      <div className="control-item">
        <span>右移:</span>
        <span className="control-key">→</span>
      </div>
      <div className="control-item">
        <span>下移:</span>
        <span className="control-key">↓</span>
      </div>
      <div className="control-item">
        <span>旋转:</span>
        <span className="control-key">↑</span>
      </div>
      <div className="control-item">
        <span>硬下落:</span>
        <span className="control-key">空格</span>
      </div>
    </div>
  );
}; 