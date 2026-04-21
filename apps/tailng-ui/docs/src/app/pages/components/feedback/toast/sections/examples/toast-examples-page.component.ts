import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngButtonComponent, TngToastComponent } from '@tailng-ui/components';
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
  selector: 'app-toast-examples-page',
  imports: [TngButtonComponent, TngToastComponent, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './toast-examples-page.component.html',
  styleUrl: './toast-examples-page.component.css',
})
export class ToastExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private demoCounter = 0;

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly wrapperActionEvents = signal<readonly string[]>([]);

  protected readonly streamPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-stream-plain-css.component.ts',
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
        "  selector: 'app-toast-examples-stream-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-examples-stream-plain-css.component.html',",
        "  styleUrl: './toast-examples-stream-plain-css.component.css',",
        '})',
        'export class ToastExamplesStreamPlainCssComponent {',
        '  private demoCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Toast example #${this.demoCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showUndoToast(toast: TngToastComponent): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Autosave snapshot #${this.demoCounter} committed.`, {',
        '      action: {',
        "        label: 'Undo',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 8));',
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
      title: 'toast-examples-stream-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section class="toast-demo-actions">',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="success" (click)="showUndoToast(toast)">Show undo toast</tng-button>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-stream-plain-css.component.css',
      code: [
        '.toast-demo-actions {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 70%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  padding: 0.95rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly streamTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-stream-tailwind.component.ts',
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
        "  selector: 'app-toast-examples-stream-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-examples-stream-tailwind.component.html',",
        "  styleUrl: './toast-examples-stream-tailwind.component.css',",
        '})',
        'export class ToastExamplesStreamTailwindComponent {',
        '  private demoCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Toast example #${this.demoCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showUndoToast(toast: TngToastComponent): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Autosave snapshot #${this.demoCounter} committed.`, {',
        '      action: {',
        "        label: 'Undo',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 8));',
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
      title: 'toast-examples-stream-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section class="flex flex-wrap gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="success" (click)="showUndoToast(toast)">Show undo toast</tng-button>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-stream-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected readonly escalationPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-escalation-plain-css.component.ts',
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
        "  selector: 'app-toast-examples-escalation-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-examples-escalation-plain-css.component.html',",
        "  styleUrl: './toast-examples-escalation-plain-css.component.css',",
        '})',
        'export class ToastExamplesEscalationPlainCssComponent {',
        '  private demoCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Toast example #${this.demoCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showRetryToast(toast: TngToastComponent): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Retry required for build check #${this.demoCounter}.`, {',
        '      action: {',
        "        dismissOnSelect: false,",
        "        label: 'Retry',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Retry selected for ${id}`, ...events].slice(0, 8));',
        '        },',
        '      },',
        '      duration: 0,',
        "      title: 'Action required',",
        "      tone: 'warning',",
        '    });',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-escalation-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section class="toast-demo-actions">',
        '  <tng-button tone="neutral" (click)="showTone(toast, \'warning\')">Show warning</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show persistent error</tng-button>',
        '  <tng-button tone="neutral" (click)="showRetryToast(toast)">Show retry snackbar</tng-button>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-escalation-plain-css.component.css',
      code: [
        '.toast-demo-actions {',
        '  background: color-mix(in srgb, var(--tng-semantic-background-canvas) 70%, transparent);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.95rem;',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '  padding: 0.95rem;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly escalationTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-escalation-tailwind.component.ts',
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
        "  selector: 'app-toast-examples-escalation-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngToastComponent],',
        "  templateUrl: './toast-examples-escalation-tailwind.component.html',",
        "  styleUrl: './toast-examples-escalation-tailwind.component.css',",
        '})',
        'export class ToastExamplesEscalationTailwindComponent {',
        '  private demoCounter = 0;',
        '',
        '  protected readonly actionEvents = signal<readonly string[]>([]);',
        '',
        '  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Toast example #${this.demoCounter}`, {',
        "      duration: tone === 'danger' ? 0 : 4200,",
        '      title: toneTitleByTone[tone],',
        '      tone,',
        '    });',
        '  }',
        '',
        '  protected showRetryToast(toast: TngToastComponent): void {',
        '    this.demoCounter += 1;',
        '    toast.show(`Retry required for build check #${this.demoCounter}.`, {',
        '      action: {',
        "        dismissOnSelect: false,",
        "        label: 'Retry',",
        '        onSelect: (id): void => {',
        '          this.actionEvents.update((events) => [`Retry selected for ${id}`, ...events].slice(0, 8));',
        '        },',
        '      },',
        '      duration: 0,',
        "      title: 'Action required',",
        "      tone: 'warning',",
        '    });',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-escalation-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<section class="flex flex-wrap gap-2 rounded-xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <tng-button tone="neutral" (click)="showTone(toast, \'warning\')">Show warning</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show persistent error</tng-button>',
        '  <tng-button tone="neutral" (click)="showRetryToast(toast)">Show retry snackbar</tng-button>',
        '</section>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-escalation-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  protected showTone(toast: TngToastComponent, tone: TngToastTone): void {
    this.demoCounter += 1;
    toast.show(`Toast example #${this.demoCounter}`, {
      duration: tone === 'danger' ? 0 : 4200,
      title: toneTitleByTone[tone],
      tone,
    });
  }

  protected showUndoToast(toast: TngToastComponent): void {
    this.demoCounter += 1;
    toast.show(`Autosave snapshot #${this.demoCounter} committed.`, {
      action: {
        label: 'Undo',
        onSelect: (id): void => {
          this.wrapperActionEvents.update((events) => [`Undo selected for ${id}`, ...events].slice(0, 8));
        },
      },
      duration: 5200,
      title: 'Saved',
      tone: 'success',
    });
  }

  protected showRetryToast(toast: TngToastComponent): void {
    this.demoCounter += 1;
    toast.show(`Retry required for build check #${this.demoCounter}.`, {
      action: {
        dismissOnSelect: false,
        label: 'Retry',
        onSelect: (id): void => {
          this.wrapperActionEvents.update((events) => [`Retry selected for ${id}`, ...events].slice(0, 8));
        },
      },
      duration: 0,
      title: 'Action required',
      tone: 'warning',
    });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
