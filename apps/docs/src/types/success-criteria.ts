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


