import React from 'react';
import { PriorityLevel } from '@site/types/requirements';

interface PriorityProps {
  level: PriorityLevel;
}

const priorityColors: Record<PriorityLevel, string> = {
  must: '#dc3545',
  should: '#fd7e14',
  could: '#28a745',
  wont: '#6c757d'
};

const priorityLabels: Record<PriorityLevel, string> = {
  must: 'Must Have',
  should: 'Should Have',
  could: 'Could Have',
  wont: "Won't Have"
};

export const Priority: React.FC<PriorityProps> = ({ level }) => {
  return (
    <span
      style={{
        backgroundColor: priorityColors[level],
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 500
      }}
    >
      {priorityLabels[level]}
    </span>
  );
};
