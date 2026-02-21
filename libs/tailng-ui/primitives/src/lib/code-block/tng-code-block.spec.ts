import { describe, expect, it } from 'vitest';
import {
  TngCodeBlock,
  TngCodeBlockBody,
  TngCodeBlockCode,
  TngCodeBlockGutter,
  TngCodeBlockHeader,
} from './tng-code-block';

describe('tng-code-block primitive', () => {
  it('exports public code block primitive symbols', () => {
    expect(typeof TngCodeBlock).toBe('function');
    expect(typeof TngCodeBlockHeader).toBe('function');
    expect(typeof TngCodeBlockBody).toBe('function');
    expect(typeof TngCodeBlockGutter).toBe('function');
    expect(typeof TngCodeBlockCode).toBe('function');
  });
});
