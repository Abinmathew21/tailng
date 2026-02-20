import { buttonRegistryItem } from './button/button.registry';
import { checkboxRegistryItem } from './checkbox/checkbox.registry';
import { inputRegistryItem } from './input/input.registry';
import { radioRegistryItem } from './radio/radio.registry';
import { textareaRegistryItem } from './textarea/textarea.registry';
import type { RegistryItem } from './registry.types';

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
