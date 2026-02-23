import { describe, expect, it } from 'vitest';
import {
  TngCard,
  TngCardContent,
  TngCardDescription,
  TngCardFooter,
  TngCardHeader,
  TngCardTitle,
} from './tng-card';

describe('tng-card primitives', () => {
  it('exports all public card directives', () => {
    expect(typeof TngCard).toBe('function');
    expect(typeof TngCardHeader).toBe('function');
    expect(typeof TngCardTitle).toBe('function');
    expect(typeof TngCardDescription).toBe('function');
    expect(typeof TngCardContent).toBe('function');
    expect(typeof TngCardFooter).toBe('function');
  });
});
