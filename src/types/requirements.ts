export type PriorityLevel = "must" | "should" | "could" | "wont"
export type StatusState = "draft" | "review" | "approved" | "rejected"

export interface Requirement {
  id: string
  title: string
  description: string
  priority: PriorityLevel
  status: StatusState
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ChangeHistory {
  date: Date
  version: string
  author: string
  changes: string
}
