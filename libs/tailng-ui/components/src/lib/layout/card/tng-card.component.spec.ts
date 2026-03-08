import { describe, expect, it } from 'vitest';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardMediaComponent,
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
    expect(typeof TngCardMediaComponent).toBe('function');
    expect(typeof TngCardActionsComponent).toBe('function');
    expect(typeof TngCardDividerComponent).toBe('function');
    expect(typeof TngCardLinkComponent).toBe('function');
  });
});
