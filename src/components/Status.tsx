import React from 'react';
import { StatusState } from '@site/types/requirements';

interface StatusProps {
  state: StatusState;
}

const statusColors: Record<StatusState, string> = {
  draft: '#6c757d',
  review: '#ffc107',
  approved: '#28a745',
  rejected: '#dc3545'
};

const statusLabels: Record<StatusState, string> = {
  draft: 'Draft',
  review: 'In Review',
  approved: 'Approved',
  rejected: 'Rejected'
};

export const Status: React.FC<StatusProps> = ({ state }) => {
  return (
    <span
      style={{
        backgroundColor: statusColors[state],
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: 500,
        marginLeft: '8px'
      }}
    >
      {statusLabels[state]}
    </span>
  );
};
