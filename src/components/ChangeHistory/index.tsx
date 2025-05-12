import type { ChangeHistory as ChangeHistoryType } from '@site/types/requirements';
import type { ReactElement } from 'react';

interface ChangeHistoryProps {
  changes: ChangeHistoryType[];
}

export function ChangeHistoryComponent({ changes }: ChangeHistoryType): ReactElement {
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
