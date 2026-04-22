import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCopy } from '@tailng-ui/primitives';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type ExampleScope =
  | 'explicit-plain'
  | 'explicit-tailwind'
  | 'target-plain'
  | 'target-tailwind';

@Component({
  selector: 'app-headless-copybutton-examples-page',
  imports: [TngCopy, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './copybutton-examples-page.component.html',
  styleUrl: './copybutton-examples-page.component.css',
})
export class HeadlessCopybuttonExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly installCommand =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  private readonly statusMap = signal<Record<ExampleScope, string>>({
    'explicit-plain': 'No copy action yet.',
    'explicit-tailwind': 'No copy action yet.',
    'target-plain': 'No copy action yet.',
    'target-tailwind': 'No copy action yet.',
  });

  protected readonly explicitPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-copybutton-examples-explicit-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-examples-explicit-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-examples-explicit-plain-css.component.html',",
        "  styleUrl: './headless-copybutton-examples-explicit-plain-css.component.css',",
        '})',
        'export class HeadlessCopybuttonExamplesExplicitPlainCssComponent {',
        "  protected readonly installCommand = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
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
      title: 'headless-copybutton-examples-explicit-plain-css.component.html',
      code: [
        '<div class="headless-copybutton-example-shell headless-copybutton-example-shell--plain">',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="headless-copybutton-trigger"',
        '    [tngCopyText]="installCommand"',
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
      title: 'headless-copybutton-examples-explicit-plain-css.component.css',
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

  protected readonly explicitTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-copybutton-examples-explicit-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-examples-explicit-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-examples-explicit-tailwind.component.html',",
        "  styleUrl: './headless-copybutton-examples-explicit-tailwind.component.css',",
        '})',
        'export class HeadlessCopybuttonExamplesExplicitTailwindComponent {',
        "  protected readonly installCommand = 'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';",
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
      title: 'headless-copybutton-examples-explicit-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="inline-flex min-h-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_62%,transparent)] bg-[var(--tng-semantic-accent-brand)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-inverse)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-accent-brand)_86%,var(--tng-semantic-foreground-primary)_14%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '    [tngCopyText]="installCommand"',
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
      title: 'headless-copybutton-examples-explicit-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly targetPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-copybutton-examples-target-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-examples-target-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-examples-target-plain-css.component.html',",
        "  styleUrl: './headless-copybutton-examples-target-plain-css.component.css',",
        '})',
        'export class HeadlessCopybuttonExamplesTargetPlainCssComponent {',
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
      title: 'headless-copybutton-examples-target-plain-css.component.html',
      code: [
        '<div class="headless-copybutton-example-shell headless-copybutton-example-shell--plain">',
        '  <pre #snippet class="headless-copybutton-snippet">',
        '<span class="headless-copybutton-snippet-line"><span class="headless-copybutton-snippet-line-no" data-copy-ignore>1</span>pnpm nx run docs:serve</span>',
        '<span class="headless-copybutton-snippet-line"><span class="headless-copybutton-snippet-line-no" data-copy-ignore>2</span>pnpm nx run docs:build</span>',
        '  </pre>',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="headless-copybutton-trigger"',
        '    [tngCopyFrom]="snippet"',
        '    [tngCopyIgnoreSelectors]="[\'[data-copy-ignore]\']"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy snippet without line numbers',
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
      title: 'headless-copybutton-examples-target-plain-css.component.css',
      code: [
        '.headless-copybutton-snippet {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  padding: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly targetTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'headless-copybutton-examples-target-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopy } from '@tailng-ui/primitives';",
        '',
        '@Component({',
        "  selector: 'app-headless-copybutton-examples-target-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopy],',
        "  templateUrl: './headless-copybutton-examples-target-tailwind.component.html',",
        "  styleUrl: './headless-copybutton-examples-target-tailwind.component.css',",
        '})',
        'export class HeadlessCopybuttonExamplesTargetTailwindComponent {',
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
      title: 'headless-copybutton-examples-target-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <pre #snippet class="m-0 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-3 text-sm text-[var(--tng-semantic-foreground-primary)]">',
        '<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>1</span>pnpm nx run docs:serve</span>',
        '<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>2</span>pnpm nx run docs:build</span>',
        '  </pre>',
        '  <button',
        '    type="button"',
        '    tngCopy',
        '    class="mt-3 inline-flex min-h-10 w-fit items-center justify-center rounded-xl border border-[var(--tng-semantic-border-default)] px-4 text-sm font-semibold text-[var(--tng-semantic-foreground-primary)] transition hover:bg-[color-mix(in_srgb,var(--tng-semantic-foreground-primary)_6%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--tng-semantic-focus-ring)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tng-semantic-background-base)]"',
        '    [tngCopyFrom]="snippet"',
        '    [tngCopyIgnoreSelectors]="[\'[data-copy-ignore]\']"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy snippet without line numbers',
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
      title: 'headless-copybutton-examples-target-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected status(scope: ExampleScope): string {
    return this.statusMap()[scope];
  }

  protected onCopied(scope: ExampleScope, payload: string): void {
    this.updateStatus(scope, `Copied ${payload.length} characters.`);
  }

  protected onCopyError(scope: ExampleScope, error: unknown): void {
    this.updateStatus(scope, this.toErrorMessage(error));
  }

  private updateStatus(scope: ExampleScope, value: string): void {
    this.statusMap.update((current) => ({
      ...current,
      [scope]: value,
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
