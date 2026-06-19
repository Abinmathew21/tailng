import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

const formSourceRoot = join(process.cwd(), 'libs/tailng-ui/components/src/lib/form');
const angularFormsAdaptersSegment = 'angular-forms-adapters/';

function collectSourceFiles(root: string): readonly string[] {
  const entries = readdirSync(root);
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(root, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === '__tests__') continue;
      files.push(...collectSourceFiles(path));
      continue;
    }

    if (entry.endsWith('.ts')) {
      files.push(path);
    }
  }

  return files;
}

function sourceText(file: string): string {
  return readFileSync(file, 'utf8');
}

function relativeSourcePath(file: string): string {
  return relative(formSourceRoot, file).replaceAll('\\', '/');
}

describe('tailng form no-CVA architecture', () => {
  it('keeps legacy Angular forms APIs isolated to angular-forms-adapters', () => {
    const violations = collectSourceFiles(formSourceRoot)
      .filter((file) => !relativeSourcePath(file).startsWith(angularFormsAdaptersSegment))
      .filter((file) =>
        /ControlValueAccessor|NG_VALUE_ACCESSOR|FormsModule|ReactiveFormsModule|from '@angular\/forms'/u.test(
          sourceText(file),
        ),
      )
      .map(relativeSourcePath);

    expect(violations).toEqual([]);
  });

  it('does not duplicate manual change outputs for model-backed values', () => {
    const violations = collectSourceFiles(formSourceRoot)
      .filter((file) => file.endsWith('.component.ts'))
      .filter((file) => {
        const text = sourceText(file);
        const duplicatesValueChange =
          /\bvalue\s*=\s*model\s*</u.test(text) && /\bvalueChange\s*=\s*output\s*</u.test(text);
        const duplicatesCheckedChange =
          /\bchecked\s*=\s*model\s*</u.test(text) && /\bcheckedChange\s*=\s*output\s*</u.test(text);

        return duplicatesValueChange || duplicatesCheckedChange;
      })
      .map(relativeSourcePath);

    expect(violations).toEqual([]);
  });
});
