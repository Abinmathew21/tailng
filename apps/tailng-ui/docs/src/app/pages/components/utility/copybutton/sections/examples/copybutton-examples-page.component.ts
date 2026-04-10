import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngCopy, type TngCopySuccessEvent } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

type CopyExampleScope =
  | 'quick-headless'
  | 'quick-plain'
  | 'quick-tailwind'
  | 'snippet-headless'
  | 'snippet-plain'
  | 'snippet-tailwind';

@Component({
  selector: 'app-copybutton-examples-page',
  imports: [
    TngCopy,
    TngCopyButtonComponent,
    TngIcon,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './copybutton-examples-page.component.html',
  styleUrl: './copybutton-examples-page.component.css',
})
export class CopybuttonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly installCommand =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  private readonly statusMap = signal<Record<CopyExampleScope, string>>({
    'quick-headless': 'No copy action yet.',
    'quick-plain': 'No copy action yet.',
    'quick-tailwind': 'No copy action yet.',
    'snippet-headless': 'No copy action yet.',
    'snippet-plain': 'No copy action yet.',
    'snippet-tailwind': 'No copy action yet.',
  });

  protected readonly quickHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-quick-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        'export class QuickCopyHeadlessComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-quick-headless.component.html',
      code: [
        '<button',
        '  type="button"',
        '  tngCopy',
        '  class="copybutton-headless-trigger"',
        '  [tngCopyText]="command"',
        '  (tngCopied)="status.set(`Copied ${$event.length} chars`)"',
        '>',
        '  Copy install command',
        '</button>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-quick-headless.component.css',
      code: [
        '.copybutton-headless-trigger {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.6rem;',
        '  min-height: 2.4rem;',
        '  padding: 0 0.95rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly quickPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-quick-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        'export class QuickCopyPlainComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-quick-plain.component.html',
      code: [
        '<tng-copy-button [text]="command" (tngCopied)="status.set(`Copied ${$event.length} chars`)">',
        '  <tng-icon copyIcon icon="copy"></tng-icon>',
        '  <tng-icon copiedIcon icon="check"></tng-icon>',
        '</tng-copy-button>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-quick-plain.component.css',
      code: [
        '.copybutton-plain-shell {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly quickTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-quick-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        'export class QuickCopyTailwindComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-quick-tailwind.component.html',
      code: [
        '<div class="rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-copy-button appearance="solid" [text]="command">',
        '    <tng-icon copyIcon icon="copy" class="h-4 w-4"></tng-icon>',
        '    <tng-icon copiedIcon icon="check" class="h-4 w-4"></tng-icon>',
        '  </tng-copy-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-quick-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly snippetHeadlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-snippet-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        'export class SnippetHeadlessCopyComponent {',
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-snippet-headless.component.html',
      code: [
        '<pre #snippet class="copybutton-snippet">',
        '  <span data-copy-ignore>1</span> pnpm nx run docs:serve',
        '  <span data-copy-ignore>2</span> pnpm nx run docs:build',
        '</pre>',
        '<button',
        '  type="button"',
        '  tngCopy',
        '  [tngCopyFrom]="snippet"',
        '  [tngCopyIgnoreSelectors]="[\'[data-copy-ignore]\']"',
        '  (tngCopySuccess)="status.set(`Copied via ${$event.method}`)"',
        '>',
        '  Copy snippet without line numbers',
        '</button>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-snippet-headless.component.css',
      code: [
        '.copybutton-snippet {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  padding: 0.85rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly snippetPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-snippet-plain.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        '',
        'export class SnippetPlainCopyComponent {',
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-snippet-plain.component.html',
      code: [
        '<pre #snippet class="copybutton-snippet">',
        '  <span data-copy-ignore>1</span> pnpm nx run docs:serve',
        '</pre>',
        '<tng-copy-button',
        '  [from]="snippet"',
        '  [ignoreSelectors]="[\'[data-copy-ignore]\']"',
        '  (tngCopied)="status.set(`Copied ${$event.length} chars`)"',
        '>',
        '  Copy from target',
        '</tng-copy-button>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-snippet-plain.component.css',
      code: [
        '.copybutton-plain-shell {',
        '  display: grid;',
        '  gap: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly snippetTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-snippet-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        'export class SnippetTailwindCopyComponent {',
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-snippet-tailwind.component.html',
      code: [
        '<pre #snippet class="rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <span data-copy-ignore class="text-slate-400">1</span> pnpm nx run docs:serve',
        '</pre>',
        '<button',
        '  type="button"',
        '  tngCopy',
        '  class="rounded-lg border border-slate-400 px-3 py-2 text-sm"',
        '  [tngCopyFrom]="snippet"',
        '  [tngCopyIgnoreSelectors]="[\'[data-copy-ignore]\']"',
        '>',
        '  Copy target snippet',
        '</button>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-snippet-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected status(scope: CopyExampleScope): string {
    return this.statusMap()[scope];
  }

  protected onCopied(scope: CopyExampleScope, payload: string): void {
    this.setStatus(scope, `Copied ${payload.length} characters.`);
  }

  protected onCopySuccess(scope: CopyExampleScope, event: TngCopySuccessEvent): void {
    this.setStatus(scope, `Copied via ${event.method}.`);
  }

  protected onCopyError(scope: CopyExampleScope, error: unknown): void {
    this.setStatus(scope, this.toErrorMessage(error));
  }

  private setStatus(scope: CopyExampleScope, message: string): void {
    this.statusMap.update((current) => ({
      ...current,
      [scope]: message,
    }));
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const nested = (error as { error: unknown }).error;
      if (nested instanceof Error && nested.message.trim().length > 0) {
        return nested.message;
      }
    }

    return 'Copy failed.';
  }

}
