import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngInput, TngInputLeading, TngInputTrailing } from '@tailng-ui/primitives';
import {
  DocsExamplePanelComponent,
  type DocsExampleCodeTab,
} from '../../../../../../shared/example-panel/docs-example-panel.component';

@Component({
  selector: 'app-input-examples-page',
  imports: [
    DocsExamplePanelComponent,
    TngInputComponent,
    TngInput,
    TngInputLeading,
    TngInputTrailing,
    TngIcon,
  ],
  templateUrl: './input-examples-page.component.html',
  styleUrl: './input-examples-page.component.css',
})
export class InputExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly searchExampleCode = [
    '<tng-input>',
    '  <span tngInputLeading aria-hidden="true">',
    '    <tng-icon icon="search" class="input-example-icon" />',
    '  </span>',
    '  <input tngInput type="search" placeholder="Search components..." />',
    '  <span tngInputTrailing class="input-example-meta">Ctrl+K</span>',
    '</tng-input>',
    '',
  ].join('\n');

  protected readonly workspaceExampleCode = [
    '<tng-input tone="primary">',
    '  <input tngInput type="text" placeholder="Workspace slug" value="core-platform" />',
    '  <span tngInputTrailing class="input-example-meta">.tailng.dev</span>',
    '</tng-input>',
    '',
  ].join('\n');

  protected readonly validationExampleCode = [
    '<tng-input tone="danger">',
    '  <input tngInput type="email" value="team@tailng" aria-invalid="true" />',
    '</tng-input>',
    '<p class="input-example-helper input-example-helper--danger">',
    '  Enter a valid email address in user@domain format.',
    '</p>',
    '',
  ].join('\n');

  protected readonly statesExampleCode = [
    '<tng-input>',
    '  <input tngInput type="text" value="Readonly API key" readonly />',
    '</tng-input>',
    '',
    '<tng-input>',
    '  <input tngInput type="text" value="Disabled while syncing" disabled />',
    '</tng-input>',
    '',
  ].join('\n');

  protected readonly searchCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'search-input-example.component.html',
      code: this.searchExampleCode,
    },
  ]);

  protected readonly workspaceCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'workspace-slug-example.component.html',
      code: this.workspaceExampleCode,
    },
  ]);

  protected readonly validationCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'validation-state-example.component.html',
      code: this.validationExampleCode,
    },
  ]);

  protected readonly statesCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'readonly-disabled-example.component.html',
      code: this.statesExampleCode,
    },
  ]);

  protected focusProjectedInput(event: MouseEvent): void {
    const hostElement = event.currentTarget;
    if (!(hostElement instanceof HTMLElement)) {
      return;
    }

    const inputElement = hostElement.querySelector('[data-slot="input"]');
    if (
      !(inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) ||
      inputElement.disabled
    ) {
      return;
    }

    inputElement.focus({ preventScroll: true });
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const view = this.documentRef.defaultView;
    const mutationObserverCtor = view?.MutationObserver;
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
