import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngCodeBlockComponent,
  TngToggleComponent,
  TngToggleGroupComponent,
} from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../toggle.util';

type ChecklistItem = 'docs' | 'qa' | 'review';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

function isChecklistItem(value: string): value is ChecklistItem {
  return value === 'docs' || value === 'qa' || value === 'review';
}

function eventCameFromToggle(event: Event): boolean {
  const target = event.target;
  return target instanceof Element && target.closest('tng-toggle') !== null;
}

function toggleChecklistItem(
  currentValues: readonly ChecklistItem[],
  value: ChecklistItem,
): readonly ChecklistItem[] {
  return currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];
}

@Component({
  selector: 'app-toggle-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngToggleComponent,
    TngToggleGroupComponent,
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
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly plainCssChecklist = signal<readonly ChecklistItem[]>(['review']);
  protected readonly tailwindChecklist = signal<readonly ChecklistItem[]>(['review', 'qa']);

  protected readonly tokenOverrideSnippet = [
    '.release-toggle-shell {',
    '  --tng-semantic-accent-brand: #2563eb;',
    '  --tng-semantic-background-surface: #ffffff;',
    '  --tng-semantic-border-strong: #cbd5e1;',
    '  --tng-semantic-border-subtle: #dbe4ee;',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.26);',
    '}',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'component-toggle-styling-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type ChecklistItem = 'docs' | 'qa' | 'review';",
      '',
      '@Component({',
      "  selector: 'app-component-toggle-styling-plain',",
      '  standalone: true,',
      '  imports: [TngToggleComponent, TngToggleGroupComponent],',
      "  templateUrl: './component-toggle-styling-plain.component.html',",
      "  styleUrl: './component-toggle-styling-plain.component.css',",
      '})',
      'export class ComponentToggleStylingPlainComponent {',
      "  readonly selectedChecks = signal<readonly ChecklistItem[]>(['review']);",
      '',
      '  onChecksChange(values: readonly string[]): void {',
      '    this.selectedChecks.set(values.filter((value): value is ChecklistItem => value === "docs" || value === "qa" || value === "review"));',
      '  }',
      '',
      '  onChecklistChoiceClick(value: ChecklistItem, event: MouseEvent): void {',
      '    const target = event.target;',
      "    if (target instanceof Element && target.closest('tng-toggle') !== null) {",
      '      return;',
      '    }',
      '',
      '    this.selectedChecks.set(',
      '      this.selectedChecks().includes(value)',
      '        ? this.selectedChecks().filter((item) => item !== value)',
      '        : [...this.selectedChecks(), value],',
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="release-toggle-shell">',
      '  <div class="release-toggle-shell__header">',
      '    <h3 class="release-toggle-shell__title">Release checklist</h3>',
      '    <p class="release-toggle-shell__body">Use token overrides on the wrapper shell so the component keeps its internal DOM private.</p>',
      '  </div>',
      '  <tng-toggle-group',
      '    class="release-toggle-shell__group"',
      '    ariaLabel="Release checklist"',
      '    [values]="selectedChecks()"',
      '    (valuesChange)="onChecksChange($event)"',
      '  >',
      '    <div class="release-toggle-shell__row" [class.release-toggle-shell__row--active]="selectedChecks().includes(\'review\')" (click)="onChecklistChoiceClick(\'review\', $event)">',
      '      <tng-toggle [value]="\'review\'" pressedLabel="Review checkpoint selected" unpressedLabel="Select review checkpoint">',
      '        <span offIcon>R</span>',
      '        <span onIcon>R</span>',
      '      </tng-toggle>',
      '      <div class="release-toggle-shell__copy">',
      '        <span class="release-toggle-shell__label">Review</span>',
      '        <span class="release-toggle-shell__meta">Human approval before publish.</span>',
      '      </div>',
      '    </div>',
      '    <div class="release-toggle-shell__row" [class.release-toggle-shell__row--active]="selectedChecks().includes(\'qa\')" (click)="onChecklistChoiceClick(\'qa\', $event)">',
      '      <tng-toggle [value]="\'qa\'" pressedLabel="QA checkpoint selected" unpressedLabel="Select QA checkpoint">',
      '        <span offIcon>Q</span>',
      '        <span onIcon>Q</span>',
      '      </tng-toggle>',
      '      <div class="release-toggle-shell__copy">',
      '        <span class="release-toggle-shell__label">QA</span>',
      '        <span class="release-toggle-shell__meta">Regression sign-off from the test pass.</span>',
      '      </div>',
      '    </div>',
      '    <div class="release-toggle-shell__row" [class.release-toggle-shell__row--active]="selectedChecks().includes(\'docs\')" (click)="onChecklistChoiceClick(\'docs\', $event)">',
      '      <tng-toggle [value]="\'docs\'" pressedLabel="Docs checkpoint selected" unpressedLabel="Select docs checkpoint">',
      '        <span offIcon>D</span>',
      '        <span onIcon>D</span>',
      '      </tng-toggle>',
      '      <div class="release-toggle-shell__copy">',
      '        <span class="release-toggle-shell__label">Docs</span>',
      '        <span class="release-toggle-shell__meta">Release notes and migration guidance.</span>',
      '      </div>',
      '    </div>',
      '  </tng-toggle-group>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.release-toggle-shell {',
      '  --tng-semantic-accent-brand: #2563eb;',
      '  --tng-semantic-background-surface: #ffffff;',
      '  --tng-semantic-border-strong: #cbd5e1;',
      '  --tng-semantic-border-subtle: #dbe4ee;',
      '  --tng-semantic-foreground-primary: #0f172a;',
      '  --tng-semantic-focus-ring: rgba(37, 99, 235, 0.26);',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 38rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid #cbd5e1;',
      '  border-radius: 1rem;',
      '  background: #ffffff;',
      '  color: #0f172a;',
      '  color-scheme: light;',
      '}',
      '',
      '.release-toggle-shell__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.release-toggle-shell__title {',
      '  margin: 0;',
      '  color: #0f172a;',
      '  font-size: 1.05rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.release-toggle-shell__body {',
      '  margin: 0;',
      '  color: #475569;',
      '  font-size: 0.9rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.release-toggle-shell__group {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0;',
      '  border: 0;',
      '  background: transparent;',
      '}',
      '',
      '.release-toggle-shell__row {',
      '  display: grid;',
      '  grid-template-columns: auto 1fr;',
      '  gap: 0.8rem;',
      '  align-items: center;',
      '  padding: 0.85rem 0.95rem;',
      '  border: 1px solid #dbe4ee;',
      '  border-radius: 1rem;',
      '  background: #f8fafc;',
      '  cursor: pointer;',
      '}',
      '',
      '.release-toggle-shell__row--active {',
      '  border-color: #bfdbfe;',
      '  background: #eff6ff;',
      '}',
      '',
      '.release-toggle-shell__copy {',
      '  display: grid;',
      '  gap: 0.1rem;',
      '}',
      '',
      '.release-toggle-shell__label {',
      '  color: #0f172a;',
      '  font-size: 0.92rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.release-toggle-shell__meta {',
      '  color: #64748b;',
      '  font-size: 0.82rem;',
      '  line-height: 1.5;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-toggle-styling-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type ChecklistItem = 'docs' | 'qa' | 'review';",
      '',
      '@Component({',
      "  selector: 'app-component-toggle-styling-tailwind',",
      '  standalone: true,',
      '  imports: [TngToggleComponent, TngToggleGroupComponent],',
      "  templateUrl: './component-toggle-styling-tailwind.component.html',",
      '})',
      'export class ComponentToggleStylingTailwindComponent {',
      "  readonly selectedChecks = signal<readonly ChecklistItem[]>(['review', 'qa']);",
      '',
      '  onChecksChange(values: readonly string[]): void {',
      '    this.selectedChecks.set(values.filter((value): value is ChecklistItem => value === "docs" || value === "qa" || value === "review"));',
      '  }',
      '',
      '  onChecklistChoiceClick(value: ChecklistItem, event: MouseEvent): void {',
      '    const target = event.target;',
      "    if (target instanceof Element && target.closest('tng-toggle') !== null) {",
      '      return;',
      '    }',
      '',
      '    this.selectedChecks.set(',
      '      this.selectedChecks().includes(value)',
      '        ? this.selectedChecks().filter((item) => item !== value)',
      '        : [...this.selectedChecks(), value],',
      '    );',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[38rem] gap-4 rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 shadow-sm [--tng-semantic-accent-brand:#2563eb] [--tng-semantic-background-surface:#ffffff] [--tng-semantic-border-strong:#cbd5e1] [--tng-semantic-border-subtle:#dbe4ee] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-focus-ring:rgba(37,99,235,0.26)] [color-scheme:light]">',
      '  <div class="grid gap-1">',
      '    <h3 class="m-0 text-lg font-semibold text-slate-900">Release checklist</h3>',
      '    <p class="m-0 text-sm leading-6 text-slate-600">Use token overrides on the wrapper shell so the component keeps its internal DOM private.</p>',
      '  </div>',
      '  <tng-toggle-group class="grid gap-3 border-0 bg-transparent p-0" ariaLabel="Release checklist" [values]="selectedChecks()" (valuesChange)="onChecksChange($event)">',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [class.border-blue-200]="selectedChecks().includes(\'review\')" [class.bg-blue-50]="selectedChecks().includes(\'review\')" [class.border-slate-200]="!selectedChecks().includes(\'review\')" [class.bg-slate-50]="!selectedChecks().includes(\'review\')" (click)="onChecklistChoiceClick(\'review\', $event)">',
      '      <tng-toggle [value]="\'review\'" pressedLabel="Review checkpoint selected" unpressedLabel="Select review checkpoint">',
      '        <span offIcon>R</span>',
      '        <span onIcon>R</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-slate-900">Review</span>',
      '        <span class="text-xs text-slate-500">Human approval before publish.</span>',
      '      </div>',
      '    </div>',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [class.border-blue-200]="selectedChecks().includes(\'qa\')" [class.bg-blue-50]="selectedChecks().includes(\'qa\')" [class.border-slate-200]="!selectedChecks().includes(\'qa\')" [class.bg-slate-50]="!selectedChecks().includes(\'qa\')" (click)="onChecklistChoiceClick(\'qa\', $event)">',
      '      <tng-toggle [value]="\'qa\'" pressedLabel="QA checkpoint selected" unpressedLabel="Select QA checkpoint">',
      '        <span offIcon>Q</span>',
      '        <span onIcon>Q</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-slate-900">QA</span>',
      '        <span class="text-xs text-slate-500">Regression sign-off from the test pass.</span>',
      '      </div>',
      '    </div>',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [class.border-blue-200]="selectedChecks().includes(\'docs\')" [class.bg-blue-50]="selectedChecks().includes(\'docs\')" [class.border-slate-200]="!selectedChecks().includes(\'docs\')" [class.bg-slate-50]="!selectedChecks().includes(\'docs\')" (click)="onChecklistChoiceClick(\'docs\', $event)">',
      '      <tng-toggle [value]="\'docs\'" pressedLabel="Docs checkpoint selected" unpressedLabel="Select docs checkpoint">',
      '        <span offIcon>D</span>',
      '        <span onIcon>D</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-slate-900">Docs</span>',
      '        <span class="text-xs text-slate-500">Release notes and migration guidance.</span>',
      '      </div>',
      '    </div>',
      '  </tng-toggle-group>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainCssChecklistChange(values: readonly string[]): void {
    this.plainCssChecklist.set(values.filter(isChecklistItem));
  }

  protected onPlainCssChecklistChoiceClick(value: ChecklistItem, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.plainCssChecklist.set(toggleChecklistItem(this.plainCssChecklist(), value));
  }

  protected onTailwindChecklistChange(values: readonly string[]): void {
    this.tailwindChecklist.set(values.filter(isChecklistItem));
  }

  protected onTailwindChecklistChoiceClick(value: ChecklistItem, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.tailwindChecklist.set(toggleChecklistItem(this.tailwindChecklist(), value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
