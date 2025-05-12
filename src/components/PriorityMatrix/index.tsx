import type { PriorityScale } from '@site/src/types/requirements';
/**
 * Priority Matrix Component.
 * @module PriorityMatrix
 * @example
 * import { PriorityMatrix } from '@site/src/components/PriorityMatrix';
 * <PriorityMatrix urgency={frontMatter.urgency} importance={frontMatter.importance} />
 */
import type { ReactElement } from 'react';

interface PriorityMatrixProps {
  importance: PriorityScale;
  urgency: PriorityScale;
}

const getBackgroundColor = (value: number, selectedValue: number): string => {
  if (value === selectedValue) return '#007bff';
  if (value >= 7) return 'rgba(220, 53, 69, 0.2)';
  if (value >= 4) return 'rgba(255, 193, 7, 0.2)';
  return 'rgba(40, 167, 69, 0.2)';
};

export function PriorityMatrix({ importance, urgency }: PriorityMatrixProps): ReactElement {
  return (
    <div
      style={{
        marginTop: '1rem',
        color: 'var(--ifm-color-content)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px repeat(9, 40px)',
          gap: '4px',
          fontSize: '0.875rem',
        }}
      >
        {/* 緊急度の行 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
          }}
        >
          緊急度
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={`urgency-${num}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 4px',
              backgroundColor: getBackgroundColor(num, urgency),
              borderRadius: '4px',
              color: num === urgency ? '#ffffff' : 'var(--ifm-color-content)',
            }}
          >
            {num}
          </div>
        ))}

        {/* 重要度の行 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
          }}
        >
          重要度
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={`importance-${num}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 4px',
              backgroundColor: getBackgroundColor(num, importance),
              borderRadius: '4px',
              color: num === importance ? '#ffffff' : 'var(--ifm-color-content)',
            }}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}
