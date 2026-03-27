import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngToggleComponent } from '@tailng-ui/components';
import { TngToggle as TngTogglePrimitive } from '@tailng-ui/primitives';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';

@Component({
  selector: 'app-toggle-styling-page',
  imports: [
    TngToggleComponent,
    TngTogglePrimitive,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toggle-styling-page.component.html',
  styleUrl: './toggle-styling-page.component.css',
})
export class ToggleStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly headlessCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-styles-headless.component.html',
      code: [
        '<div class="toolbar-row">',
        '  <button tngToggle class="toolbar-toggle" [pressed]="true">Bold</button>',
        '  <button tngToggle class="toolbar-toggle" [pressed]="false">Italic</button>',
        '  <button tngToggle class="toolbar-toggle" [disabled]="true">Disabled</button>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-styles-headless.component.css',
      code: [
        '.toolbar-row { display: inline-flex; gap: 0.5rem; }',
        '.toolbar-toggle {',
        '  align-items: center;',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-strong);',
        '  border-radius: 0.65rem;',
        '  color: var(--tng-semantic-foreground-primary);',
        '  cursor: pointer;',
        '  display: inline-flex;',
        '  font-weight: 600;',
        '  justify-content: center;',
        '  min-height: 2rem;',
        '  min-width: 5.5rem;',
        '  padding: 0.35rem 0.8rem;',
        '}',
        '.toolbar-toggle[data-state="on"] {',
        '  background: var(--tng-semantic-accent-brand);',
        '  color: var(--tng-color-white);',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-styles-plain.component.html',
      code: [
        '<div class="settings-panel">',
        '  <tng-toggle [pressed]="true" pressedLabel="Disable bold" unpressedLabel="Enable bold">',
        '    <span offIcon>B</span>',
        '    <span onIcon>B</span>',
        '  </tng-toggle>',
        '  <tng-toggle [pressed]="false" pressedLabel="Disable italic" unpressedLabel="Enable italic">',
        '    <span offIcon>I</span>',
        '    <span onIcon>I</span>',
        '  </tng-toggle>',
        '  <tng-toggle [disabled]="true">Disabled</tng-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-styles-plain.component.css',
      code: [
        '.settings-panel {',
        '  background: var(--tng-semantic-background-surface);',
        '  border: 1px solid var(--tng-semantic-border-subtle);',
        '  border-radius: 0.8rem;',
        '  display: grid;',
        '  gap: 0.75rem;',
        '  padding: 0.9rem 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toggle-styles-tailwind.component.html',
      code: [
        '<div class="grid gap-3 rounded-xl border border-slate-300 bg-white/80 p-4">',
        '  <tng-toggle [pressed]="true" class="text-slate-900">',
        '    <span offIcon>grid</span>',
        '    <span onIcon>grid</span>',
        '  </tng-toggle>',
        '  <tng-toggle [pressed]="false" class="text-slate-900">',
        '    <span offIcon>list</span>',
        '    <span onIcon>list</span>',
        '  </tng-toggle>',
        '  <tng-toggle [disabled]="true" class="text-slate-900">disabled</tng-toggle>',
        '</div>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'toggle-styles-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
