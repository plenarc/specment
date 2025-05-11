import React from 'react';
import { ChangeHistory as ChangeHistoryType } from '@site/types/requirements';

interface ChangeHistoryProps {
  changes: ChangeHistoryType[];
}

export const ChangeHistoryComponent: React.FC<ChangeHistoryProps> = ({ changes }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>日付</th>
          <th>変更者</th>
          <th>変更内容</th>
        </tr>
      </thead>
      <tbody>
        {changes.map((change, index) => (
          <tr key={index}>
            <td>{new Date(change.date).toLocaleDateString('ja-JP')}</td>
            <td>{change.author}</td>
            <td>{change.changes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
