import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngCodeBlockComponent, TngToastComponent } from '@tailng-ui/components';
import type { TngToastTone } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({
  danger: 'Error',
  neutral: 'Info',
  success: 'Success',
  warning: 'Warning',
});

@Component({
  selector: 'app-toast-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngToastComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toast-overview-page.component.html',
  styleUrl: './toast-overview-page.component.css',
})
export class ToastOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private previewCounter = 0;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly actionEvents = signal<readonly string[]>([]);

  protected readonly componentImportCode = [
    "import { TngButtonComponent, TngToastComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-overview-plain-css.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent, TngToastComponent } from '@tailng-ui/components';",
        "import type { TngToastTone } from '@tailng-ui/primitives';",
        '',
        "const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({",
        "  danger: 'Error',",
        "  neutral: 'Info',",
        "  success: 'Success',",
        "  warning: 'Warning',",
        '});',
        '',
        '@Component({',
        "  selector: 'app-toast-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-overview-plain-css.component.html',",
        "  styleUrl: './toast-overview-plain-css.component.css',",
        '})',
        'export class ToastOverviewPlainCssComponent {',
        '  private previewCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.previewCounter += 1;',
        '    toast.show(`Toast preview #${this.previewCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showUndoToast(toast: TngToastComponent): void {',
        '    this.previewCounter += 1;',
        '    toast.show(`Saved draft #${this.previewCounter}`, {',
        '      action: {',
        "        label: 'Undo',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 6));',
        '        },',
        '      },',
        '      duration: 5200,',
        "      title: 'Saved',",
        "      tone: 'success',",
        '    });',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-overview-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section class="toast-preview-controls toast-preview-controls--plain">',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show error</tng-button>',
        '  <tng-button tone="success" (click)="showUndoToast(toast)">Show undo toast</tng-button>',
        '</section>',
        '',
        '@if (actionEvents().length > 0) {',
        '  <p class="toast-action-status">Latest action: {{ actionEvents()[0] }}</p>',
        '}',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-overview-plain-css.component.css',
      code: [
        '.toast-preview-controls {',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  padding: 0.95rem;',
        '}',
        '',
        '.toast-preview-controls--plain {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 70%, transparent);',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-overview-tailwind.component.ts',
      code: [
        "import { Component, signal } from '@angular/core';",
        "import { TngButtonComponent, TngToastComponent } from '@tailng-ui/components';",
        "import type { TngToastTone } from '@tailng-ui/primitives';",
        '',
        "const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({",
        "  danger: 'Error',",
        "  neutral: 'Info',",
        "  success: 'Success',",
        "  warning: 'Warning',",
        '});',
        '',
        '@Component({',
        "  selector: 'app-toast-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-overview-tailwind.component.html',",
        "  styleUrl: './toast-overview-tailwind.component.css',",
        '})',
        'export class ToastOverviewTailwindComponent {',
        '  private previewCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.previewCounter += 1;',
        '    toast.show(`Toast preview #${this.previewCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showUndoToast(toast: TngToastComponent): void {',
        '    this.previewCounter += 1;',
        '    toast.show(`Saved draft #${this.previewCounter}`, {',
        '      action: {',
        "        label: 'Undo',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 6));',
        '        },',
        '      },',
        '      duration: 5200,',
        "      title: 'Saved',",
        "      tone: 'success',",
        '    });',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-overview-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section',
        '  class="flex flex-wrap gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4"',
        '>',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show error</tng-button>',
        '  <tng-button tone="success" (click)="showUndoToast(toast)">Show undo toast</tng-button>',
        '</section>',
        '',
        '@if (actionEvents().length > 0) {',
        '  <p class="toast-action-status">Latest action: {{ actionEvents()[0] }}</p>',
        '}',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {
    this.previewCounter += 1;
    toast.show(`Toast preview #${this.previewCounter}`, {
      duration: tone === 'danger' ? 0 : 4200,
      title: toneTitleByTone[tone],
      tone,
    });
  }

  protected showUndoToast(toast: TngToastComponent): void {
    this.previewCounter += 1;
    toast.show(`Saved draft #${this.previewCounter}`, {
      action: {
        label: 'Undo',
        onSelect: (id): void => {
          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 6));
        },
      },
      duration: 5200,
      title: 'Saved',
      tone: 'success',
    });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
