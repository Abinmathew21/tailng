import { describe, expect, it } from 'vitest';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from './tng-card.component';

describe('tng-card component', () => {
  it('exports all public card components', () => {
    expect(typeof TngCardComponent).toBe('function');
    expect(typeof TngCardHeaderComponent).toBe('function');
    expect(typeof TngCardTitleComponent).toBe('function');
    expect(typeof TngCardDescriptionComponent).toBe('function');
    expect(typeof TngCardContentComponent).toBe('function');
    expect(typeof TngCardFooterComponent).toBe('function');
  });
});
