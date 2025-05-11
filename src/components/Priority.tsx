import React from 'react';
import type { PriorityScale } from '@site/src/types/requirements';

interface PriorityProps {
  importance: PriorityScale;
  urgency: PriorityScale;
}

const getColor = (value: PriorityScale): string => {
  if (value >= 7) return '#dc3545';
  if (value >= 4) return '#ffc107';
  return '#28a745';
};

export const Priority: React.FC<PriorityProps> = ({ importance, urgency }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span
        style={{
          backgroundColor: getColor(urgency),
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        緊急度：{urgency}
      </span>
      <span
        style={{
          backgroundColor: getColor(importance),
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        重要度：{importance}
      </span>
    </div>
  );
};
