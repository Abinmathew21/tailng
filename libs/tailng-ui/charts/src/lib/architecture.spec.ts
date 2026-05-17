import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TNG_CATALOG_CHART_PRESETS } from './series/catalog/catalog-registry';

const libRoot = dirname(fileURLToPath(import.meta.url));

const categorySlugOverrides = new Map<string, string>([
  ['GEO/Map', 'geo-map'],
  ['PictorialBar', 'pictorial-bar'],
  ['ThemeRiver', 'theme-river'],
]);

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/GEO/g, 'Geo')
    .replace(/OHLC/g, 'Ohlc')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase())
    .join('-');
}

function toCategorySlug(category: string): string {
  return categorySlugOverrides.get(category) ?? toKebabCase(category);
}

function listTypeScriptFiles(directory: string): readonly string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return listTypeScriptFiles(path);
    }

    return path.endsWith('.ts') && !path.endsWith('.spec.ts') ? [path] : [];
  });
}

function resolveImportPath(fromFile: string, importPath: string): string | null {
  const basePath = resolve(dirname(fromFile), importPath);
  const candidates = [`${basePath}.ts`, join(basePath, 'index.ts')];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function readRelativeImports(file: string): readonly string[] {
  const source = readFileSync(file, 'utf8');
  const imports: string[] = [];
  const importPattern = /^\s*import\s+(?!type\b)(?:[\s\S]*?)\s+from\s+['"](\.{1,2}\/[^'"]+)['"]/gm;
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(source)) !== null) {
    imports.push(match[1] ?? '');
  }

  return imports.filter((importPath) => importPath.length > 0);
}

function findFirstCycle(graph: ReadonlyMap<string, readonly string[]>): readonly string[] {
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const stack: string[] = [];

  function visit(file: string): readonly string[] {
    if (visiting.has(file)) {
      return stack.slice(stack.indexOf(file)).concat(file);
    }

    if (visited.has(file)) {
      return [];
    }

    visiting.add(file);
    stack.push(file);

    for (const dependency of graph.get(file) ?? []) {
      const cycle = visit(dependency);
      if (cycle.length > 0) {
        return cycle;
      }
    }

    stack.pop();
    visiting.delete(file);
    visited.add(file);
    return [];
  }

  for (const file of graph.keys()) {
    const cycle = visit(file);
    if (cycle.length > 0) {
      return cycle;
    }
  }

  return [];
}

describe('charts package architecture', () => {
  it('keeps direct ECharts imports inside the echarts adapter directory', () => {
    const offenders = listTypeScriptFiles(libRoot)
      .filter((file) => !file.includes('/echarts/'))
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        return /\bfrom\s+['"]echarts(?:\/[^'"]*)?['"]/.test(source)
          || /\bimport\(\s*['"]echarts(?:\/[^'"]*)?['"]\s*\)/.test(source);
      })
      .map((file) => relative(libRoot, file));

    expect(offenders).toEqual([]);
  });

  it('does not introduce relative import cycles', () => {
    const files = listTypeScriptFiles(libRoot);
    const graph = new Map(
      files.map((file) => [
        file,
        readRelativeImports(file)
          .map((importPath) => resolveImportPath(file, importPath))
          .filter((resolvedFile): resolvedFile is string => resolvedFile !== null),
      ]),
    );
    const cycle = findFirstCycle(graph).map((file) => relative(libRoot, file));

    expect(cycle).toEqual([]);
  });

  it('tracks the requested ECharts catalog as category folders with unique selectors', () => {
    const selectors = TNG_CATALOG_CHART_PRESETS.map((preset) => preset.selector);
    const categories = new Set(TNG_CATALOG_CHART_PRESETS.map((preset) => preset.category));

    expect(TNG_CATALOG_CHART_PRESETS).toHaveLength(143);
    expect(categories.size).toBe(24);
    expect(new Set(selectors).size).toBe(selectors.length);

    for (const preset of TNG_CATALOG_CHART_PRESETS) {
      const categorySlug = toCategorySlug(preset.category);
      const chartFolder = join(libRoot, 'series', categorySlug, preset.slug);
      const componentPath = join(chartFolder, `tng-${preset.slug}-chart.component.ts`);
      const optionFactoryPath = join(chartFolder, `${preset.slug}-option.factory.ts`);

      expect(existsSync(chartFolder)).toBe(true);
      expect(existsSync(componentPath)).toBe(true);
      expect(existsSync(optionFactoryPath)).toBe(true);
    }
  });
});
