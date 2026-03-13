import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngCopy } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-copybutton-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCopy,
    TngCopyButtonComponent,
    TngIcon,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './copybutton-overview-page.component.html',
  styleUrl: './copybutton-overview-page.component.css',
})
export class CopybuttonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly command = 'pnpm add @tailng-ui/components';
  protected readonly headlessStatus = signal('No copy action yet.');
  protected readonly plainStatus = signal('No copy action yet.');
  protected readonly tailwindStatus = signal('No copy action yet.');

  protected readonly primitiveImportCode = "import { TngCopy } from '@tailng-ui/primitives';";
  protected readonly componentImportCode =
    "import { TngCopyButtonComponent } from '@tailng-ui/components';";

  protected readonly primitiveUsageCode = [
    '<button',
    '  type="button"',
    '  tngCopy',
    '  [tngCopyText]="installCommand"',
    '  (tngCopied)="onCopied($event)"',
    '  (tngCopyError)="onCopyError($event)"',
    '>',
    '  Copy install command',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-copy-button',
    '  [text]="installCommand"',
    '  appearance="outline"',
    '  (tngCopied)="onCopied($event)"',
    '  (tngCopyError)="onCopyError($event)"',
    '>',
    '  <tng-icon copyIcon icon="copy"></tng-icon>',
    '  <tng-icon copiedIcon icon="check"></tng-icon>',
    '</tng-copy-button>',
    '',
  ].join('\n');

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-overview-headless.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngCopy],',
        '  templateUrl: \"./copybutton-overview-headless.component.html\",',
        '  styleUrl: \"./copybutton-overview-headless.component.css\",',
        '})',
        'export class CopybuttonOverviewHeadlessComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components';",
        "  protected readonly status = signal('No copy action yet.');",
        '',
        '  protected onCopied(payload: string): void {',
        '    this.status.set(`Copied ${payload.length} characters.`);',
        '  }',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-overview-headless.component.html',
      code: [
        '<div class="copy-overview-shell copy-overview-shell--headless">',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="copy-headless-trigger"',
        '    [tngCopyText]="command"',
        '    (tngCopied)="onCopied($event)"',
        '  >',
        '    Copy install command',
        '  </button>',
        '  <p class="copy-overview-status">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-overview-headless.component.css',
      code: [
        '.copy-headless-trigger {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.6rem;',
        '  min-height: 2.4rem;',
        '  padding: 0 0.95rem;',
        '}',
        '.copy-overview-status { color: var(--tng-semantic-foreground-secondary); }',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        '@Component({',
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent, TngIcon],',
        '  templateUrl: \"./copybutton-overview-plain-css.component.html\",',
        '  styleUrl: \"./copybutton-overview-plain-css.component.css\",',
        '})',
        'export class CopybuttonOverviewPlainCssComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components';",
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-overview-plain-css.component.html',
      code: [
        '<div class="copy-overview-shell copy-overview-shell--plain">',
        '  <tng-copy-button [text]="command" (tngCopied)="status.set(`Copied ${$event.length} chars`)" >',
        '    <tng-icon copyIcon icon="copy"></tng-icon>',
        '    <tng-icon copiedIcon icon="check"></tng-icon>',
        '  </tng-copy-button>',
        '  <p class="copy-overview-status">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-overview-plain-css.component.css',
      code: [
        '.copy-overview-shell--plain {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        'export class CopybuttonOverviewTailwindComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components';",
        "  protected readonly status = signal('No copy action yet.');",
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'copybutton-overview-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-copy-button',
        '    appearance="solid"',
        '    [text]="command"',
        '    class="text-slate-900 dark:text-slate-100"',
        '    (tngCopied)="status.set(`Copied ${$event.length} chars`)"',
        '  >',
        '    <tng-icon copyIcon icon="copy" class="h-4 w-4"></tng-icon>',
        '    <tng-icon copiedIcon icon="check" class="h-4 w-4"></tng-icon>',
        '  </tng-copy-button>',
        '  <p class="text-sm text-slate-600 dark:text-slate-300">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onHeadlessCopied(payload: string): void {
    this.headlessStatus.set(`Copied ${payload.length} characters.`);
  }

  protected onPlainCopied(payload: string): void {
    this.plainStatus.set(`Copied ${payload.length} characters.`);
  }

  protected onTailwindCopied(payload: string): void {
    this.tailwindStatus.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(error: unknown, scope: 'headless' | 'plain' | 'tailwind'): void {
    const message = this.toErrorMessage(error);
    if (scope === 'headless') {
      this.headlessStatus.set(message);
      return;
    }

    if (scope === 'plain') {
      this.plainStatus.set(message);
      return;
    }

    this.tailwindStatus.set(message);
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

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
