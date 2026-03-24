export type RegistryFile = Readonly<{
  content: string;
  path: string;
}>;

export type RegistryInstallMetadata = Readonly<{
  importPath: string;
  importSymbols: readonly string[];
}>;

export type RegistryItemSource = Readonly<{
  dependencies: readonly string[];
  description: string;
  files: readonly RegistryFile[];
  name: string;
}>;

export type RegistryItem = RegistryItemSource &
  Readonly<{
    install: RegistryInstallMetadata;
  }>;
