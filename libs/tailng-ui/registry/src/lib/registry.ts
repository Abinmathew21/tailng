import { buttonRegistryItem } from './button/button.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { inputRegistryItem } from './input/input.registry';
import { radioRegistryItem } from './radio/radio.registry';
import type { RegistryItem } from './registry.types';
import { textareaRegistryItem } from './textarea/textarea.registry';

export const tailngRegistry: readonly RegistryItem[] = [
  buttonRegistryItem,
  checkboxRegistryItem,
  inputRegistryItem,
  radioRegistryItem,
  textareaRegistryItem,
];

export function getRegistryItem(name: string): RegistryItem | undefined {
  return tailngRegistry.find((item) => item.name === name);
}

export function listRegistryItemNames(): readonly string[] {
  return tailngRegistry.map((item) => item.name);
}
