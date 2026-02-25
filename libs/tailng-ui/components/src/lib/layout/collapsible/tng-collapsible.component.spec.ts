import { describe, expect, it } from 'vitest';
import {
  TngCollapsibleComponent,
  createTngCollapsibleContentId,
  toggleTngCollapsibleState,
} from './tng-collapsible.component';

describe('tng-collapsible component', () => {
  it('exports the component and generates content ids', () => {
    expect(typeof TngCollapsibleComponent).toBe('function');

    const firstId = createTngCollapsibleContentId();
    const secondId = createTngCollapsibleContentId();
    expect(firstId).not.toBe(secondId);
    expect(firstId).toContain('tng-collapsible-content-');
  });

  it('toggles open state while honoring disabled flag', () => {
    expect(toggleTngCollapsibleState(false, false)).toBe(true);
    expect(toggleTngCollapsibleState(true, false)).toBe(false);
    expect(toggleTngCollapsibleState(true, true)).toBe(true);
  });
});
