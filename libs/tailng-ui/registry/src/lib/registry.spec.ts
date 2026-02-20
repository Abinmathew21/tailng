import { describe, expect, it } from 'vitest';
import { avatarRegistryItem } from './avatar/avatar.registry';
import { buttonRegistryItem } from './button/button.registry';
import { cardRegistryItem } from './card/card.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { emptyRegistryItem } from './empty/empty.registry';
import { inputRegistryItem } from './input/input.registry';
import { progressBarRegistryItem } from './progress-bar/progress-bar.registry';
import { progressSpinnerRegistryItem } from './progress-spinner/progress-spinner.registry';
import { radioRegistryItem } from './radio/radio.registry';
import { getRegistryItem, listRegistryItemNames, tailngRegistry } from './registry';
import { separatorRegistryItem } from './separator/separator.registry';
import { tagRegistryItem } from './tag/tag.registry';
import { textareaRegistryItem } from './textarea/textarea.registry';

describe('registry names', () => {
  it('returns all registered component names in stable order', () => {
    expect(listRegistryItemNames()).toEqual([
      'avatar',
      'tag',
      'button',
      'card',
      'checkbox',
      'empty',
      'input',
      'progress-bar',
      'progress-spinner',
      'radio',
      'separator',
      'textarea',
    ]);
  });
});

describe('registry lookup', () => {
  it('contains all item references and resolves items by name', () => {
    const expectedItems = [
      ['avatar', avatarRegistryItem],
      ['tag', tagRegistryItem],
      ['button', buttonRegistryItem],
      ['card', cardRegistryItem],
      ['checkbox', checkboxRegistryItem],
      ['empty', emptyRegistryItem],
      ['input', inputRegistryItem],
      ['progress-bar', progressBarRegistryItem],
      ['progress-spinner', progressSpinnerRegistryItem],
      ['radio', radioRegistryItem],
      ['separator', separatorRegistryItem],
      ['textarea', textareaRegistryItem],
    ] as const;

    for (const [name, item] of expectedItems) {
      expect(tailngRegistry).toContain(item);
      expect(getRegistryItem(name)).toEqual(item);
    }

    expect(getRegistryItem('unknown')).toBeUndefined();
  });
});
