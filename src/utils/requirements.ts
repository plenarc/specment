import type { Requirement } from '@site/types/requirements';

export const validateRequirement = (req: Requirement): boolean => {
  // 要求の妥当性チェックロジック
  return true;
};

export const generateRequirementId = (prefix = 'REQ'): string => {
  // 要求ID生成ロジック
  return `${prefix}-${String(Date.now()).slice(-3)}`;
};
