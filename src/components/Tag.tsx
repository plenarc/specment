import React from 'react';

interface TagProps {
  name: string;
}

export const Tag: React.FC<TagProps> = ({ name }) => {
  return (
    <span
      style={{
        backgroundColor: '#e9ecef',
        color: '#495057',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        marginRight: '4px'
      }}
    >
      {name}
    </span>
  );
};
