import { getRegistryItem, listRegistryItemNames } from '@tailng-ui/registry';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { runCli } from './index';

type CliRegistryModule = Readonly<{
  getRegistryItem: typeof getRegistryItem;
  listRegistryItemNames: typeof listRegistryItemNames;
}>;

const registryModule: CliRegistryModule = {
  getRegistryItem,
  listRegistryItemNames,
};

const createdRoots: string[] = [];

async function createTargetRoot(): Promise<string> {
  const targetRoot = await mkdtemp(path.join(tmpdir(), 'tailng-cli-'));
  createdRoots.push(targetRoot);
  return targetRoot;
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

afterEach(async (): Promise<void> => {
  for (const root of createdRoots) {
    await rm(root, { recursive: true, force: true });
  }

  createdRoots.length = 0;
});

it('tailng cli integration: dry-run does not write files to disk', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'button', '--cwd', targetRoot, '--dry-run'], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts'))).toBe(
    false,
  );
});

it('tailng cli integration: add writes all button source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const buttonTsPath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-button-primitive.ts');
  const indexPath = path.join(targetRoot, 'src/app/tailng-ui/button/index.ts');

  expect(await pathExists(buttonTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(indexPath)).toBe(true);

  const buttonTsContent = await readFile(buttonTsPath, 'utf8');
  expect(buttonTsContent).toContain("selector: 'tng-button'");

  const indexContent = await readFile(indexPath, 'utf8');
  expect(indexContent).toContain("export * from './tng-button';");
  expect(indexContent).toContain("export * from './tng-button-primitive';");
});

it('tailng cli integration: add writes accordion source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'accordion', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/accordion/tng-accordion.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/accordion/tng-accordion-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menu/tng-menu.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menu/tng-menu-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes dropdown-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'dropdown-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/dropdown-menu/tng-dropdown-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes context-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'context-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/context-menu/tng-context-menu.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/context-menu/tng-context-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes menubar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'menubar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menubar/tng-menubar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/menubar/tng-menubar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes navigation-menu source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'navigation-menu', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/navigation-menu/tng-navigation-menu.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/navigation-menu/tng-navigation-menu-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes toolbar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'toolbar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toolbar/tng-toolbar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toolbar/tng-toolbar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tabs source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tabs', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tabs/tng-tabs.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tabs/tng-tabs-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes stepper source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'stepper', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/stepper/tng-stepper.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/stepper/tng-stepper-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes toggle-group source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'toggle-group', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/toggle-group/tng-toggle-group.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/toggle-group/tng-toggle-group-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes chips source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'chips', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/chips/tng-chips.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/chips/tng-chips-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes combobox source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'combobox', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/combobox/tng-combobox.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/combobox/tng-combobox-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes select source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'select', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/select/tng-select.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/select/tng-select-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes autocomplete source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'autocomplete', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/autocomplete/tng-autocomplete.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/autocomplete/tng-autocomplete-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes multiselect source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'multiselect', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/multiselect/tng-multiselect.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/multiselect/tng-multiselect-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes grid source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'grid', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/grid/tng-grid.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/grid/tng-grid-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tree source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tree', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tree/tng-tree.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tree/tng-tree-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes drawer source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'drawer', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/drawer/tng-drawer-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes bottom-sheet source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'bottom-sheet', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/bottom-sheet/tng-bottom-sheet-primitive.ts'),
    ),
  ).toBe(true);
});
it('tailng cli integration: add writes avatar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'avatar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/avatar/tng-avatar.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/avatar/tng-avatar-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes tag source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'tag', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tag/tng-tag.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/tag/tng-tag-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes badge source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'badge', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/badge/tng-badge.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/badge/tng-badge-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes copy source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'copy', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/copy/tng-copy-button.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/copy/tng-copy-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes checkbox source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'checkbox', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/checkbox/tng-checkbox.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/checkbox/tng-checkbox-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes card source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'card', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card.ts'))).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card-primitive.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/card/tng-card-footer.html')),
  ).toBe(true);
});

it('tailng cli integration: add writes empty source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'empty', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(await pathExists(path.join(targetRoot, 'src/app/tailng-ui/empty/tng-empty.ts'))).toBe(
    true,
  );
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/empty/tng-empty-actions.html')),
  ).toBe(true);
});

it('tailng cli integration: add writes progress-bar source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'progress-bar', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/progress-bar/tng-progress-bar.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-bar/tng-progress-bar-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes progress-spinner source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'progress-spinner', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner.ts'),
    ),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/progress-spinner/tng-progress-spinner-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes separator source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'separator', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/separator/tng-separator.ts')),
  ).toBe(true);
  expect(
    await pathExists(
      path.join(targetRoot, 'src/app/tailng-ui/separator/tng-separator-primitive.ts'),
    ),
  ).toBe(true);
});

it('tailng cli integration: add writes textarea source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'textarea', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/textarea/tng-textarea.ts')),
  ).toBe(true);
  expect(
    await pathExists(path.join(targetRoot, 'src/app/tailng-ui/textarea/tng-textarea-primitive.ts')),
  ).toBe(true);
});

it('tailng cli integration: add writes dialog source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'dialog', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const dialogTsPath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog-primitive.ts');
  const htmlPath = path.join(targetRoot, 'src/app/tailng-ui/dialog/tng-dialog.html');

  expect(await pathExists(dialogTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(htmlPath)).toBe(true);

  const dialogTsContent = await readFile(dialogTsPath, 'utf8');
  expect(dialogTsContent).toContain("selector: 'tng-dialog'");
  expect(dialogTsContent).toContain("from './tng-dialog-primitive';");
});

it('tailng cli integration: add writes popover source files', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const exitCode = await runCli(['add', 'popover', '--cwd', targetRoot], {
    registry: registryModule,
  });

  expect(exitCode).toBe(0);

  const popoverTsPath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover.ts');
  const primitivePath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover-primitive.ts');
  const htmlPath = path.join(targetRoot, 'src/app/tailng-ui/popover/tng-popover.html');

  expect(await pathExists(popoverTsPath)).toBe(true);
  expect(await pathExists(primitivePath)).toBe(true);
  expect(await pathExists(htmlPath)).toBe(true);

  const popoverTsContent = await readFile(popoverTsPath, 'utf8');
  expect(popoverTsContent).toContain("selector: 'tng-popover'");
  expect(popoverTsContent).toContain("from './tng-popover-primitive';");
});

it('tailng cli integration: returns non-zero when files already exist without --force', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const firstRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(firstRunExitCode).toBe(0);

  const secondRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(secondRunExitCode).toBe(1);
});

it('tailng cli integration: overwrites files when --force is provided', async (): Promise<void> => {
  const targetRoot = await createTargetRoot();

  const firstRunExitCode = await runCli(['add', 'button', '--cwd', targetRoot], {
    registry: registryModule,
  });
  expect(firstRunExitCode).toBe(0);

  const buttonTsPath = path.join(targetRoot, 'src/app/tailng-ui/button/tng-button.ts');
  await writeFile(buttonTsPath, '// stale content\n', 'utf8');

  const overwriteExitCode = await runCli(['add', 'button', '--cwd', targetRoot, '--force'], {
    registry: registryModule,
  });
  expect(overwriteExitCode).toBe(0);

  const overwrittenContent = await readFile(buttonTsPath, 'utf8');
  expect(overwrittenContent).toContain('export class TngButton');
  expect(overwrittenContent).not.toContain('// stale content');
});
