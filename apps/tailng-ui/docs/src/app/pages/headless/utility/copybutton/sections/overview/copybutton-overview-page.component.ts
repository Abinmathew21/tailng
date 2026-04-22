import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { TngCopy } from '@tailng-ui/primitives';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-copybutton-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngCopy,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './copybutton-overview-page.component.html',
  styleUrl: './copybutton-overview-page.component.css',
})
export class HeadlessCopybuttonOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly command =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  protected readonly plainStatus = signal('No copy action yet.');
  protected readonly tailwindStatus = signal('No copy action yet.');

  protected readonly importCode = [
    "import { TngCopy } from '@tailng-ui/primitives';",
    '',
  ].join('\n');

  protected readonly basicUsageCode = [
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

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-copybutton-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-overview-plain-css.component.html',",
        "  styleUrl: './headless-copybutton-overview-plain-css.component.css',",
        '})',
        'export class HeadlessCopybuttonOverviewPlainCssComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
        "  protected readonly status = signal('No copy action yet.');",
        '',
        '  protected onCopied(payload: string): void {',
        '    this.status.set(`Copied ${payload.length} characters.`);',
        '  }',
        '',
        '  protected onCopyError(): void {',
        "    this.status.set('Copy failed.');",
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-copybutton-overview-plain-css.component.html',
      code: [
        '<div class="headless-copybutton-preview headless-copybutton-preview--plain">',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="headless-copybutton-trigger"',
        '    [tngCopyText]="command"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy install command',
        '  </button>',
        '  <p class="headless-copybutton-status">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-copybutton-overview-plain-css.component.css',
      code: [
        '.headless-copybutton-trigger {',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  min-height: 2.5rem;',
        '  padding: 0 0.95rem;',
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
      title: 'headless-copybutton-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-overview-tailwind.component.html',",
        "  styleUrl: './headless-copybutton-overview-tailwind.component.css',",
        '})',
        'export class HeadlessCopybuttonOverviewTailwindComponent {',
        "  protected readonly command = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
        "  protected readonly status = signal('No copy action yet.');",
        '',
        '  protected onCopied(payload: string): void {',
        '    this.status.set(`Copied ${payload.length} characters.`);',
        '  }',
        '',
        '  protected onCopyError(): void {',
        "    this.status.set('Copy failed.');",
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'headless-copybutton-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_62%,transparent)] bg-[var(--tng-semantic-accent-brand)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_86%,var(--tng-semantic-foreground-primary)_14%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '    [tngCopyText]="command"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy install command',
        '  </button>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'headless-copybutton-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainCopied(payload: string): void {
    this.plainStatus.set(`Copied ${payload.length} characters.`);
  }

  protected onTailwindCopied(payload: string): void {
    this.tailwindStatus.set(`Copied ${payload.length} characters.`);
  }

  protected onCopyError(scope: 'plain' | 'tailwind', error: unknown): void {
    const message = this.toErrorMessage(error);
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
}
