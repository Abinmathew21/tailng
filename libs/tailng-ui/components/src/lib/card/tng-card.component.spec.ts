import { describe, expect, it } from 'vitest';
import {
  TngCard,
  TngCardContent,
  TngCardDescription,
  TngCardFooter,
  TngCardHeader,
  TngCardTitle,
} from './tng-card.component';

describe('tng-card component', () => {
  it('exports all public card components', () => {
    expect(typeof TngCard).toBe('function');
    expect(typeof TngCardHeader).toBe('function');
    expect(typeof TngCardTitle).toBe('function');
    expect(typeof TngCardDescription).toBe('function');
    expect(typeof TngCardContent).toBe('function');
    expect(typeof TngCardFooter).toBe('function');
  });
});
