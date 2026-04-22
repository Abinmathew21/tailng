import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngCopyButtonComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-copybutton-overview-page',
  imports: [
    TngCodeBlockComponent,
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

  protected readonly componentImportCode = [
    "import { TngCopyButtonComponent } from '@tailng-ui/components';",
    "import { TngIcon } from '@tailng-ui/icons';",
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
        "  selector: 'app-copybutton-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent, TngIcon],',
        "  templateUrl: './copybutton-overview-plain-css.component.html',",
        "  styleUrl: './copybutton-overview-plain-css.component.css',",
        '})',
        'export class CopybuttonOverviewPlainCssComponent {',
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
      title: 'copybutton-overview-plain-css.component.html',
      code: [
        '<div class="copybutton-overview-preview copybutton-overview-preview--plain">',
        '  <tng-copy-button',
        '    [text]="command"',
        '    appearance="outline"',
        '    (tngCopied)="onCopied($event)"',
        '    (tngCopyError)="onCopyError()"',
        '  >',
        '    <tng-icon copyIcon icon="copy"></tng-icon>',
        '    <tng-icon copiedIcon icon="check"></tng-icon>',
        '  </tng-copy-button>',
        '  <p class="copybutton-overview-status">{{ status() }}</p>',
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
        '.copybutton-overview-preview--plain {',
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
        '@Component({',
        "  selector: 'app-copybutton-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngCopyButtonComponent, TngIcon],',
        "  templateUrl: './copybutton-overview-tailwind.component.html',",
        "  styleUrl: './copybutton-overview-tailwind.component.css',",
        '})',
        'export class CopybuttonOverviewTailwindComponent {',
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
      title: 'copybutton-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-copy-button',
        '    [text]="command"',
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
      title: 'copybutton-overview-tailwind.component.css',
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
