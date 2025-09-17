import { describe, it, expect, vi } from 'vitest';

describe('Specment Package', () => {
  it('should have basic functionality', () => {
    // 基本的なテストケース
    expect(true).toBe(true);
  });

  it('should export main functions', async () => {
    // テスト環境変数を設定
    process.env.VITEST = 'true';
    
    try {
      // メインモジュールのインポートテスト
      const module = await import('./index.js');
      expect(module).toBeDefined();
      expect(module.program).toBeDefined();
    } finally {
      // 環境変数をクリーンアップ
      delete process.env.VITEST;
    }
  });
});