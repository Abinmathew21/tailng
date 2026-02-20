import { describe, expect, it } from 'vitest';
import { buttonRegistryItem } from './button/button.registry';
import { cardRegistryItem } from './card/card.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { inputRegistryItem } from './input/input.registry';
import { radioRegistryItem } from './radio/radio.registry';
import { getRegistryItem, listRegistryItemNames, tailngRegistry } from './registry';
import { textareaRegistryItem } from './textarea/textarea.registry';

describe('registry helpers', () => {
  it('returns all registered component names', () => {
    expect(listRegistryItemNames()).toEqual([
      'button',
      'card',
      'checkbox',
      'input',
      'radio',
      'textarea',
    ]);
    expect(tailngRegistry).toContain(buttonRegistryItem);
    expect(tailngRegistry).toContain(cardRegistryItem);
    expect(tailngRegistry).toContain(checkboxRegistryItem);
    expect(tailngRegistry).toContain(inputRegistryItem);
    expect(tailngRegistry).toContain(radioRegistryItem);
    expect(tailngRegistry).toContain(textareaRegistryItem);
  });

  it('resolves known item and returns undefined for unknown', () => {
    expect(getRegistryItem('button')).toEqual(buttonRegistryItem);
    expect(getRegistryItem('card')).toEqual(cardRegistryItem);
    expect(getRegistryItem('checkbox')).toEqual(checkboxRegistryItem);
    expect(getRegistryItem('input')).toEqual(inputRegistryItem);
    expect(getRegistryItem('radio')).toEqual(radioRegistryItem);
    expect(getRegistryItem('textarea')).toEqual(textareaRegistryItem);
    expect(getRegistryItem('unknown')).toBeUndefined();
  });
});
