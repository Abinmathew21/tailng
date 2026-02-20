import { accordionRegistryItem } from './accordion/accordion.registry';
import { avatarRegistryItem } from './avatar/avatar.registry';
import { buttonRegistryItem } from './button/button.registry';
import { cardRegistryItem } from './card/card.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { dialogRegistryItem } from './dialog/dialog.registry';
import { emptyRegistryItem } from './empty/empty.registry';
import { inputRegistryItem } from './input/input.registry';
import { menuRegistryItem } from './menu/menu.registry';
import { popoverRegistryItem } from './popover/popover.registry';
import { progressBarRegistryItem } from './progress-bar/progress-bar.registry';
import { progressSpinnerRegistryItem } from './progress-spinner/progress-spinner.registry';
import { radioRegistryItem } from './radio/radio.registry';
import type { RegistryItem } from './registry.types';
import { separatorRegistryItem } from './separator/separator.registry';
import { tagRegistryItem } from './tag/tag.registry';
import { textareaRegistryItem } from './textarea/textarea.registry';

export const tailngRegistry: readonly RegistryItem[] = [
  accordionRegistryItem,
  avatarRegistryItem,
  tagRegistryItem,
  buttonRegistryItem,
  cardRegistryItem,
  checkboxRegistryItem,
  dialogRegistryItem,
  emptyRegistryItem,
  inputRegistryItem,
  menuRegistryItem,
  popoverRegistryItem,
  progressBarRegistryItem,
  progressSpinnerRegistryItem,
  radioRegistryItem,
  separatorRegistryItem,
  textareaRegistryItem,
];

export function getRegistryItem(name: string): RegistryItem | undefined {
  return tailngRegistry.find((item) => item.name === name);
}

export function listRegistryItemNames(): readonly string[] {
  return tailngRegistry.map((item) => item.name);
}
