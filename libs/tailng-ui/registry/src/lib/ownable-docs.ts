import { getRegistryItem } from './registry';

export function getRegistryGeneratedFilePaths(name: string): readonly string[] {
  const item = getRegistryItem(name);
  return item?.files.map((file) => file.path) ?? [];
}

export function getRegistryImportSymbols(name: string): readonly string[] {
  return getRegistryItem(name)?.install.importSymbols ?? [];
}
