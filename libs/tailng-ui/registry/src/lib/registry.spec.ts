import { describe, expect, it } from 'vitest';
import { avatarRegistryItem } from './avatar/avatar.registry';
import { buttonRegistryItem } from './button/button.registry';
import { cardRegistryItem } from './card/card.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { dialogRegistryItem } from './dialog/dialog.registry';
import { inputRegistryItem } from './input/input.registry';
import { popoverRegistryItem } from './popover/popover.registry';
import { radioRegistryItem } from './radio/radio.registry';
import { getRegistryItem, listRegistryItemNames, tailngRegistry } from './registry';
import { textareaRegistryItem } from './textarea/textarea.registry';

describe('registry helpers', () => {
  it('returns all registered component names', () => {
    expect(listRegistryItemNames()).toEqual([
      'avatar',
      'button',
      'card',
      'checkbox',
      'dialog',
      'input',
      'popover',
      'radio',
      'textarea',
    ]);
    expect(tailngRegistry).toContain(avatarRegistryItem);
    expect(tailngRegistry).toContain(buttonRegistryItem);
    expect(tailngRegistry).toContain(cardRegistryItem);
    expect(tailngRegistry).toContain(checkboxRegistryItem);
    expect(tailngRegistry).toContain(dialogRegistryItem);
    expect(tailngRegistry).toContain(inputRegistryItem);
    expect(tailngRegistry).toContain(popoverRegistryItem);
    expect(tailngRegistry).toContain(radioRegistryItem);
    expect(tailngRegistry).toContain(textareaRegistryItem);
  });

  it('resolves known item and returns undefined for unknown', () => {
    expect(getRegistryItem('avatar')).toEqual(avatarRegistryItem);
    expect(getRegistryItem('button')).toEqual(buttonRegistryItem);
    expect(getRegistryItem('card')).toEqual(cardRegistryItem);
    expect(getRegistryItem('checkbox')).toEqual(checkboxRegistryItem);
    expect(getRegistryItem('dialog')).toEqual(dialogRegistryItem);
    expect(getRegistryItem('input')).toEqual(inputRegistryItem);
    expect(getRegistryItem('popover')).toEqual(popoverRegistryItem);
    expect(getRegistryItem('radio')).toEqual(radioRegistryItem);
    expect(getRegistryItem('textarea')).toEqual(textareaRegistryItem);
    expect(getRegistryItem('unknown')).toBeUndefined();
  });
});
