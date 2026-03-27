import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngButtonComponent, TngToastComponent } from '@tailng-ui/components';
import {
  TngToastItem,
  TngToastViewport,
  type TngToastTone,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

const toneTitleByTone: Readonly<Record<TngToastTone, string>> = Object.freeze({
  danger: 'Error',
  neutral: 'Info',
  success: 'Success',
  warning: 'Warning',
});

interface HeadlessToast {
  readonly id: number;
  readonly message: string;
  readonly title: string;
  readonly tone: TngToastTone;
}

@Component({
  selector: 'app-toast-examples-page',
  imports: [
    TngButtonComponent,
    TngToastComponent,
    TngToastItem,
    TngToastViewport,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toast-examples-page.component.html',
  styleUrl: './toast-examples-page.component.css',
})
export class ToastExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);
  private readonly headlessTimers = new Map<number, ReturnType<typeof setTimeout>>();
  private demoCounter = 0;
  private headlessToastCounter = 0;
  protected readonly wrapperActionEvents = signal<readonly string[]>([]);
  protected readonly streamHeadlessToasts = signal<readonly HeadlessToast[]>([]);
  protected readonly escalationHeadlessToasts = signal<readonly HeadlessToast[]>([]);

  protected readonly streamHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-stream-headless.component.ts',
      code: [
        "import { signal } from '@angular/core';",
        "import { TngToastItem, TngToastViewport } from '@tailng-ui/primitives';",
        '',
        "readonly toasts = signal<{ id: number; tone: 'neutral' | 'success'; title: string; message: string }[]>([]);",
        "showStreamToast(tone: 'neutral' | 'success') {",
        '  // Push toast and auto-dismiss after a short timeout.',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-stream-headless.component.html',
      code: [
        '<section class="toast-headless-stack">',
        '  <section class="toast-headless-actions">',
        '    <button type="button" class="toast-headless-trigger" (click)="showHeadlessStreamToast(\'neutral\')">Show info toast</button>',
        '    <button type="button" class="toast-headless-trigger" (click)="showHeadlessStreamToast(\'success\')">Show success toast</button>',
        '  </section>',
        '  <section tngToastViewport class="toast-headless-viewport">',
        '    @for (toast of streamHeadlessToasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="toast-headless-item">',
        '        <strong>{{ toast.title }}</strong>',
        '        <p>{{ toast.message }}</p>',
        '      </article>',
        '    }',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-stream-headless.component.css',
      code: [
        '.toast-headless-stack {',
        '  display: grid;',
        '  gap: 0.65rem;',
        '  min-height: 10rem;',
        '  position: relative;',
        '}',
        '.toast-headless-viewport {',
        '  pointer-events: none;',
        '  position: absolute;',
        '  right: 0.95rem;',
        '  top: 4.2rem;',
        '  width: min(22rem, calc(100% - 1.9rem));',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly streamPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-stream-plain-css.component.ts',
      code: "import { TngToastComponent, TngButtonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-stream-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="toast-demo-actions">',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="success" (click)="showActionToast(toast, \'undo\')">Show undo toast</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-stream-plain-css.component.css',
      code: [
        '.toast-demo-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly streamTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-stream-tailwind.component.ts',
      code: "import { TngToastComponent, TngButtonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-stream-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button (click)="showTone(toast, \'neutral\')">Show info</tng-button>',
        '  <tng-button tone="success" (click)="showTone(toast, \'success\')">Show success</tng-button>',
        '  <tng-button tone="success" (click)="showActionToast(toast, \'undo\')">Show undo toast</tng-button>',
        '</div>',
        '',
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

  protected readonly escalationHeadlessTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-escalation-headless.component.ts',
      code: [
        "import { signal } from '@angular/core';",
        "import { TngToastItem, TngToastViewport } from '@tailng-ui/primitives';",
        '',
        "readonly escalationToasts = signal<{ id: number; tone: 'warning' | 'danger'; title: string; message: string }[]>([]);",
        "showEscalationToast(tone: 'warning' | 'danger') {",
        '  // Warning auto-dismisses; danger stays until explicitly dismissed.',
        '}',
        '',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-escalation-headless.component.html',
      code: [
        '<section class="toast-headless-stack">',
        '  <section class="toast-headless-actions">',
        '    <button type="button" class="toast-headless-trigger toast-headless-trigger--warning" (click)="showHeadlessEscalationToast(\'warning\')">Show warning toast</button>',
        '    <button type="button" class="toast-headless-trigger toast-headless-trigger--danger" (click)="showHeadlessEscalationToast(\'danger\')">Show persistent error</button>',
        '  </section>',
        '  <section tngToastViewport class="toast-headless-viewport">',
        '    @for (toast of escalationHeadlessToasts(); track toast.id) {',
        '      <article tngToastItem [tone]="toast.tone" class="toast-headless-item">',
        '        <strong>{{ toast.title }}</strong>',
        '        <p>{{ toast.message }}</p>',
        '        @if (toast.tone === \'danger\') {',
        '          <button type="button" class="toast-headless-dismiss" (click)="dismissHeadlessToast(\'escalation\', toast.id)">Dismiss</button>',
        '        }',
        '      </article>',
        '    }',
        '  </section>',
        '</section>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-escalation-headless.component.css',
      code: [
        '.toast-headless-item[data-tone="danger"] {',
        '  border-color: var(--tng-semantic-accent-danger);',
        '}',
        '.toast-headless-dismiss {',
        '  justify-self: start;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly escalationPlainTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-escalation-plain-css.component.ts',
      code: "import { TngToastComponent, TngButtonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-escalation-plain-css.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="toast-demo-actions">',
        '  <tng-button tone="neutral" (click)="showTone(toast, \'warning\')">Show warning</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show persistent error</tng-button>',
        '  <tng-button tone="neutral" (click)="showActionToast(toast, \'retry\')">Show retry snackbar</tng-button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toast-examples-escalation-plain-css.component.css',
      code: [
        '.toast-demo-actions {',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.55rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly escalationTailwindTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'toast-examples-escalation-tailwind.component.ts',
      code: "import { TngToastComponent, TngButtonComponent } from '@tailng-ui/components';\n",
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toast-examples-escalation-tailwind.component.html',
      code: [
        '<tng-toast #toast position="bottom-right"></tng-toast>',
        '<div class="flex flex-wrap gap-2 rounded-xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">',
        '  <tng-button tone="neutral" (click)="showTone(toast, \'warning\')">Show warning</tng-button>',
        '  <tng-button tone="danger" (click)="showTone(toast, \'danger\')">Show persistent error</tng-button>',
        '  <tng-button tone="neutral" (click)="showActionToast(toast, \'retry\')">Show retry snackbar</tng-button>',
        '</div>',
        '',
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

  protected showActionToast(toast: TngToastComponent, kind: 'retry' | 'undo'): void {
    this.demoCounter += 1;
    if (kind === 'undo') {
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
      return;
    }

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

  protected showHeadlessStreamToast(tone: 'neutral' | 'success'): void {
    this.pushHeadlessToast(
      'stream',
      tone,
      tone === 'success'
        ? 'Deployment finished for release-v2.'
        : 'Autosave completed for workspace settings.',
    );
  }

  protected showHeadlessEscalationToast(tone: 'warning' | 'danger'): void {
    this.pushHeadlessToast(
      'escalation',
      tone,
      tone === 'danger'
        ? 'Rollback required. Manual approval is pending.'
        : 'Validation skipped for optional security policy.',
    );
  }

  protected dismissHeadlessToast(scope: 'stream' | 'escalation', id: number): void {
    this.clearHeadlessTimer(id);
    this.updateHeadlessToasts(scope, (toasts) => toasts.filter((toast) => toast.id !== id));
  }

  public ngOnDestroy(): void {
    this.headlessTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.headlessTimers.clear();
    this.colorSchemeObserver?.disconnect();
  }

  private pushHeadlessToast(
    scope: 'stream' | 'escalation',
    tone: TngToastTone,
    message: string,
  ): void {
    this.headlessToastCounter += 1;
    const id = this.headlessToastCounter;

    this.updateHeadlessToasts(scope, (toasts) => [
      ...toasts,
      {
        id,
        message,
        title: toneTitleByTone[tone],
        tone,
      },
    ]);

    if (tone === 'danger') {
      return;
    }

    const timerId = setTimeout(() => {
      this.clearHeadlessTimer(id);
      this.updateHeadlessToasts(scope, (toasts) => toasts.filter((toast) => toast.id !== id));
    }, 4200);

    this.headlessTimers.set(id, timerId);
  }

  private clearHeadlessTimer(id: number): void {
    const timerId = this.headlessTimers.get(id);
    if (timerId === undefined) {
      return;
    }
    clearTimeout(timerId);
    this.headlessTimers.delete(id);
  }

  private updateHeadlessToasts(
    scope: 'stream' | 'escalation',
    updater: (toasts: readonly HeadlessToast[]) => readonly HeadlessToast[],
  ): void {
    const target = scope === 'stream' ? this.streamHeadlessToasts : this.escalationHeadlessToasts;
    target.update((toasts) => updater(toasts));
  }

}
