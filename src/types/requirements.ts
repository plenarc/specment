export type PriorityScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface PriorityLevel {
  importance: PriorityScale;
  urgency: PriorityScale;
}

export interface ChangeHistory {
  date: Date
  version: string
  author: string
  changes: string
}
