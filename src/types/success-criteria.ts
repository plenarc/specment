export type Status = 'not-started' | 'planned' | 'in-progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface SuccessCriterion {
  id: string;
  indicator: string;
  target: string;
  deadline: string;
  measurement: string;
  status: Status;
  priority: Priority;
}

// モジュール宣言
declare module '*.tsv' {
  const content: string;
  export default content;
}
