import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

type CopybuttonExampleScope =
  | 'install-plain'
  | 'install-tailwind'
  | 'target-plain'
  | 'target-tailwind';

@Component({
  selector: 'app-copybutton-examples-page',
  imports: [
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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly installCommand =
    'pnpm add @tailng-ui/components @tailng-ui/primitives @tailng-ui/cdk';
  private readonly statusMap = signal<Record<CopybuttonExampleScope, string>>({
    'install-plain': 'No copy action yet.',
    'install-tailwind': 'No copy action yet.',
    'target-plain': 'No copy action yet.',
    'target-tailwind': 'No copy action yet.',
  });

  protected readonly installPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-examples-install-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        '@Component({',
        "  selector: 'app-copybutton-examples-install-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent, TngIcon],',
        "  templateUrl: './copybutton-examples-install-plain-css.component.html',",
        "  styleUrl: './copybutton-examples-install-plain-css.component.css',",
        '})',
        'export class CopybuttonExamplesInstallPlainCssComponent {',
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
      title: 'copybutton-examples-install-plain-css.component.html',
      code: [
        '<div class="copybutton-example-shell copybutton-example-shell--plain">',
        '  <tng-copy-button',
        '    [text]="installCommand"',
        '    appearance="outline"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    <tng-icon copyIcon icon="copy"></tng-icon>',
        '    <tng-icon copiedIcon icon="check"></tng-icon>',
        '  </tng-copy-button>',
        '  <p class="copybutton-example-status">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-examples-install-plain-css.component.css',
      code: [
        '.copybutton-example-shell--plain {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.85rem;',
        '  padding: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly installTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-examples-install-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        "import { TngIcon } from '@tailng-ui/icons';",
        '',
        '@Component({',
        "  selector: 'app-copybutton-examples-install-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent, TngIcon],',
        "  templateUrl: './copybutton-examples-install-tailwind.component.html',",
        "  styleUrl: './copybutton-examples-install-tailwind.component.css',",
        '})',
        'export class CopybuttonExamplesInstallTailwindComponent {',
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
      title: 'copybutton-examples-install-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-copy-button',
        '    [text]="installCommand"',
        '    appearance="outline"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    <tng-icon copyIcon icon="copy" class="h-4 w-4"></tng-icon>',
        '    <tng-icon copiedIcon icon="check" class="h-4 w-4"></tng-icon>',
        '  </tng-copy-button>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-examples-install-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly targetPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-examples-target-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-copybutton-examples-target-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent],',
        "  templateUrl: './copybutton-examples-target-plain-css.component.html',",
        "  styleUrl: './copybutton-examples-target-plain-css.component.css',",
        '})',
        'export class CopybuttonExamplesTargetPlainCssComponent {',
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
      title: 'copybutton-examples-target-plain-css.component.html',
      code: [
        '<div class="copybutton-example-shell copybutton-example-shell--plain">',
        '  <pre #snippet class="copybutton-snippet">',
        '<span class="copybutton-snippet-line"><span class="copybutton-snippet-line-no" data-copy-ignore>1</span>pnpm nx run docs:serve</span>',
        '<span class="copybutton-snippet-line"><span class="copybutton-snippet-line-no" data-copy-ignore>2</span>pnpm nx run docs:build</span>',
        '  </pre>',
        '  <tng-copy-button',
        '    [from]="snippet"',
        '    [ignoreSelectors]="[\'[data-copy-ignore]\']"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy snippet without line numbers',
        '  </tng-copy-button>',
        '  <p class="copybutton-example-status">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-examples-target-plain-css.component.css',
      code: [
        '.copybutton-snippet {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.75rem;',
        '  padding: 0.75rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly targetTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'copybutton-examples-target-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngCopyButtonComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-copybutton-examples-target-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent],',
        "  templateUrl: './copybutton-examples-target-tailwind.component.html',",
        "  styleUrl: './copybutton-examples-target-tailwind.component.css',",
        '})',
        'export class CopybuttonExamplesTargetTailwindComponent {',
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
      title: 'copybutton-examples-target-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <pre #snippet class="m-0 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-base)] p-3 text-sm text-[var(--tng-semantic-foreground-primary)]">',
        '<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>1</span>pnpm nx run docs:serve</span>',
        '<span class="block"><span class="mr-2 text-[var(--tng-semantic-foreground-muted)]" data-copy-ignore>2</span>pnpm nx run docs:build</span>',
        '  </pre>',
        '  <tng-copy-button',
        '    class="mt-3"',
        '    [from]="snippet"',
        '    [ignoreSelectors]="[\'[data-copy-ignore]\']"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    Copy snippet without line numbers',
        '  </tng-copy-button>',
        '  <p class="mt-3 text-sm text-[var(--tng-semantic-foreground-secondary)]">{{ status() }}</p>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'copybutton-examples-target-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected status(scope: CopybuttonExampleScope): string {
    return this.statusMap()[scope];
  }

  protected onCopied(scope: CopybuttonExampleScope, payload: string): void {
    this.updateStatus(scope, `Copied ${payload.length} characters.`);
  }

  protected onCopyError(scope: CopybuttonExampleScope, error: unknown): void {
    this.updateStatus(scope, this.toErrorMessage(error));
  }

  private updateStatus(scope: CopybuttonExampleScope, value: string): void {
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
