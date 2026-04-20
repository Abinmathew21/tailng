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

type DensityMode = 'compact' | 'comfortable' | 'spacious';

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

function isDensityMode(value: string | null): value is DensityMode {
  return value === 'compact' || value === 'comfortable' || value === 'spacious';
}

function eventCameFromToggle(event: Event): boolean {
  const target = event.target;
  return target instanceof Element && target.closest('tng-toggle') !== null;
}

@Component({
  selector: 'app-toggle-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngToggleComponent,
    TngToggleGroupComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './toggle-overview-page.component.html',
  styleUrl: './toggle-overview-page.component.css',
})
export class ToggleOverviewPageComponent implements OnDestroy {
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

  protected readonly plainCssDensity = signal<DensityMode>('comfortable');
  protected readonly tailwindDensity = signal<DensityMode>('comfortable');

  protected readonly componentImportCode =
    "import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';\n";

  protected readonly standaloneUsageCode = [
    '<tng-toggle',
    '  [pressed]="sidebarPinned()"',
    '  pressedLabel="Unpin sidebar"',
    '  unpressedLabel="Pin sidebar"',
    '  (pressedChange)="sidebarPinned.set($event)"',
    '>',
    '  <span offIcon>P</span>',
    '  <span onIcon>P</span>',
    '</tng-toggle>',
    '',
  ].join('\n');

  protected readonly groupedUsageCode = [
    '<tng-toggle-group',
    '  selectionMode="single"',
    '  ariaLabel="Editor density"',
    '  [value]="density()"',
    '  (valueChange)="onDensityChange($event)"',
    '>',
    '  <tng-toggle',
    '    [value]="\'compact\'"',
    '    pressedLabel="Compact density selected"',
    '    unpressedLabel="Select compact density"',
    '  >',
    '    <span offIcon>C</span>',
    '    <span onIcon>C</span>',
    '  </tng-toggle>',
    '  <tng-toggle',
    '    [value]="\'comfortable\'"',
    '    pressedLabel="Comfortable density selected"',
    '    unpressedLabel="Select comfortable density"',
    '  >',
    '    <span offIcon>M</span>',
    '    <span onIcon>M</span>',
    '  </tng-toggle>',
    '</tng-toggle-group>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs = createCodeTabs(
    'component-toggle-overview-plain',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type DensityMode = 'compact' | 'comfortable' | 'spacious';",
      '',
      '@Component({',
      "  selector: 'app-component-toggle-overview-plain',",
      '  standalone: true,',
      '  imports: [TngToggleComponent, TngToggleGroupComponent],',
      "  templateUrl: './component-toggle-overview-plain.component.html',",
      "  styleUrl: './component-toggle-overview-plain.component.css',",
      '})',
      'export class ComponentToggleOverviewPlainComponent {',
      "  readonly selectedDensity = signal<DensityMode>('comfortable');",
      '',
      '  onDensityChange(value: string | null): void {',
      "    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {",
      '      this.selectedDensity.set(value);',
      '    }',
      '  }',
      '',
      '  onDensityChoiceClick(value: DensityMode, event: MouseEvent): void {',
      "    const target = event.target;",
      "    if (target instanceof Element && target.closest('tng-toggle') !== null) {",
      '      return;',
      '    }',
      '',
      '    this.selectedDensity.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="component-toggle-density-card">',
      '  <div class="component-toggle-density-card__header">',
      '    <p class="component-toggle-density-card__eyebrow">Writing workspace</p>',
      '    <h3 class="component-toggle-density-card__title">Editor density</h3>',
      '    <p class="component-toggle-density-card__body">Choose how compact the writing workspace should feel.</p>',
      '  </div>',
      '  <tng-toggle-group',
      '    selectionMode="single"',
      '    ariaLabel="Editor density"',
      '    [value]="selectedDensity()"',
      '    (valueChange)="onDensityChange($event)"',
      '  >',
      '    <div class="component-toggle-density-card__choice" [class.component-toggle-density-card__choice--active]="selectedDensity() === \'compact\'" (click)="onDensityChoiceClick(\'compact\', $event)">',
      '      <tng-toggle [value]="\'compact\'" pressedLabel="Compact density selected" unpressedLabel="Select compact density">',
      '        <span offIcon>C</span>',
      '        <span onIcon>C</span>',
      '      </tng-toggle>',
      '      <div class="component-toggle-density-card__copy">',
      '        <span class="component-toggle-density-card__label">Compact</span>',
      '        <span class="component-toggle-density-card__meta">Fits more lines on screen.</span>',
      '      </div>',
      '    </div>',
      '    <div class="component-toggle-density-card__choice" [class.component-toggle-density-card__choice--active]="selectedDensity() === \'comfortable\'" (click)="onDensityChoiceClick(\'comfortable\', $event)">',
      '      <tng-toggle [value]="\'comfortable\'" pressedLabel="Comfortable density selected" unpressedLabel="Select comfortable density">',
      '        <span offIcon>M</span>',
      '        <span onIcon>M</span>',
      '      </tng-toggle>',
      '      <div class="component-toggle-density-card__copy">',
      '        <span class="component-toggle-density-card__label">Comfortable</span>',
      '        <span class="component-toggle-density-card__meta">Balanced spacing for drafting.</span>',
      '      </div>',
      '    </div>',
      '    <div class="component-toggle-density-card__choice" [class.component-toggle-density-card__choice--active]="selectedDensity() === \'spacious\'" (click)="onDensityChoiceClick(\'spacious\', $event)">',
      '      <tng-toggle [value]="\'spacious\'" pressedLabel="Spacious density selected" unpressedLabel="Select spacious density">',
      '        <span offIcon>S</span>',
      '        <span onIcon>S</span>',
      '      </tng-toggle>',
      '      <div class="component-toggle-density-card__copy">',
      '        <span class="component-toggle-density-card__label">Spacious</span>',
      '        <span class="component-toggle-density-card__meta">Adds breathing room for review.</span>',
      '      </div>',
      '    </div>',
      '  </tng-toggle-group>',
      '  <p class="component-toggle-density-card__summary">Selected: {{ selectedDensity() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    [
      '.component-toggle-density-card {',
      '  display: grid;',
      '  gap: 1rem;',
      '  inline-size: min(100%, 38rem);',
      '  margin-inline: auto;',
      '  padding: 1rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: var(--tng-semantic-background-surface);',
      '  color: var(--tng-semantic-foreground-primary);',
      '  color-scheme: light;',
      '  box-shadow: 0 20px 40px -32px rgba(15, 23, 42, 0.22);',
      '}',
      '',
      '.component-toggle-density-card__header {',
      '  display: grid;',
      '  gap: 0.35rem;',
      '}',
      '',
      '.component-toggle-density-card__eyebrow {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.78rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.12em;',
      '  text-transform: uppercase;',
      '}',
      '',
      '.component-toggle-density-card__title {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 1.1rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.component-toggle-density-card__body {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.92rem;',
      '  line-height: 1.6;',
      '}',
      '',
      '.component-toggle-density-card tng-toggle-group {',
      '  display: grid;',
      '  gap: 0.75rem;',
      '  padding: 0;',
      '  border: 0;',
      '  background: transparent;',
      '}',
      '',
      '.component-toggle-density-card__choice {',
      '  display: grid;',
      '  grid-template-columns: auto 1fr;',
      '  gap: 0.85rem;',
      '  align-items: center;',
      '  padding: 0.85rem 0.95rem;',
      '  border: 1px solid var(--tng-semantic-border-subtle);',
      '  border-radius: 1rem;',
      '  background: color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%);',
      '  cursor: pointer;',
      '  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;',
      '}',
      '',
      '.component-toggle-density-card__choice--active {',
      '  border-color: color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%);',
      '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%);',
      '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.08);',
      '}',
      '',
      '.component-toggle-density-card__copy {',
      '  display: grid;',
      '  gap: 0.15rem;',
      '}',
      '',
      '.component-toggle-density-card__label {',
      '  color: var(--tng-semantic-foreground-primary);',
      '  font-size: 0.92rem;',
      '  font-weight: 700;',
      '}',
      '',
      '.component-toggle-density-card__meta {',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  line-height: 1.5;',
      '}',
      '',
      '.component-toggle-density-card__summary {',
      '  margin: 0;',
      '  color: var(--tng-semantic-foreground-secondary);',
      '  font-size: 0.82rem;',
      '  text-transform: capitalize;',
      '}',
      '',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-toggle-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';",
      '',
      "type DensityMode = 'compact' | 'comfortable' | 'spacious';",
      '',
      '@Component({',
      "  selector: 'app-component-toggle-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngToggleComponent, TngToggleGroupComponent],',
      "  templateUrl: './component-toggle-overview-tailwind.component.html',",
      '})',
      'export class ComponentToggleOverviewTailwindComponent {',
      "  readonly selectedDensity = signal<DensityMode>('comfortable');",
      '',
      '  onDensityChange(value: string | null): void {',
      "    if (value === 'compact' || value === 'comfortable' || value === 'spacious') {",
      '      this.selectedDensity.set(value);',
      '    }',
      '  }',
      '',
      '  onDensityChoiceClick(value: DensityMode, event: MouseEvent): void {',
      "    const target = event.target;",
      "    if (target instanceof Element && target.closest('tng-toggle') !== null) {",
      '      return;',
      '    }',
      '',
      '    this.selectedDensity.set(value);',
      '  }',
      '}',
      '',
    ].join('\n'),
    [
      '<section class="grid w-full max-w-[38rem] gap-4 rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[var(--tng-semantic-background-surface)] p-4 text-[var(--tng-semantic-foreground-primary)] shadow-sm">',
      '  <div class="grid gap-1">',
      '    <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tng-semantic-foreground-secondary)]">Writing workspace</p>',
      '    <h3 class="m-0 text-lg font-semibold text-[var(--tng-semantic-foreground-primary)]">Editor density</h3>',
      '    <p class="m-0 text-sm leading-6 text-[var(--tng-semantic-foreground-secondary)]">Choose how compact the writing workspace should feel.</p>',
      '  </div>',
      '  <tng-toggle-group',
      '    selectionMode="single"',
      '    ariaLabel="Editor density"',
      '    [value]="selectedDensity()"',
      '    (valueChange)="onDensityChange($event)"',
      '  >',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedDensity() === \'compact\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)\' : \'var(--tng-semantic-border-subtle)\'" [style.background]="selectedDensity() === \'compact\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)\' : \'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)\'" (click)="onDensityChoiceClick(\'compact\', $event)">',
      '      <tng-toggle [value]="\'compact\'" pressedLabel="Compact density selected" unpressedLabel="Select compact density">',
      '        <span offIcon>C</span>',
      '        <span onIcon>C</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Compact</span>',
      '        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Fits more lines on screen.</span>',
      '      </div>',
      '    </div>',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedDensity() === \'comfortable\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)\' : \'var(--tng-semantic-border-subtle)\'" [style.background]="selectedDensity() === \'comfortable\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)\' : \'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)\'" (click)="onDensityChoiceClick(\'comfortable\', $event)">',
      '      <tng-toggle [value]="\'comfortable\'" pressedLabel="Comfortable density selected" unpressedLabel="Select comfortable density">',
      '        <span offIcon>M</span>',
      '        <span onIcon>M</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Comfortable</span>',
      '        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Balanced spacing for drafting.</span>',
      '      </div>',
      '    </div>',
      '    <div class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border p-3 transition" [style.border-color]="selectedDensity() === \'spacious\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 30%, var(--tng-semantic-border-subtle) 70%)\' : \'var(--tng-semantic-border-subtle)\'" [style.background]="selectedDensity() === \'spacious\' ? \'color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, var(--tng-semantic-background-surface) 88%)\' : \'color-mix(in srgb, var(--tng-semantic-background-surface) 92%, var(--tng-semantic-foreground-primary) 8%)\'" (click)="onDensityChoiceClick(\'spacious\', $event)">',
      '      <tng-toggle [value]="\'spacious\'" pressedLabel="Spacious density selected" unpressedLabel="Select spacious density">',
      '        <span offIcon>S</span>',
      '        <span onIcon>S</span>',
      '      </tng-toggle>',
      '      <div class="grid gap-0.5">',
      '        <span class="text-sm font-semibold text-[var(--tng-semantic-foreground-primary)]">Spacious</span>',
      '        <span class="text-xs text-[var(--tng-semantic-foreground-secondary)]">Adds breathing room for review.</span>',
      '      </div>',
      '    </div>',
      '  </tng-toggle-group>',
      '  <p class="m-0 text-xs text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ selectedDensity() }}</p>',
      '</section>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainCssDensityChange(value: string | null): void {
    if (isDensityMode(value)) {
      this.plainCssDensity.set(value);
    }
  }

  protected onPlainCssDensityChoiceClick(value: DensityMode, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.plainCssDensity.set(value);
  }

  protected onTailwindDensityChange(value: string | null): void {
    if (isDensityMode(value)) {
      this.tailwindDensity.set(value);
    }
  }

  protected onTailwindDensityChoiceClick(value: DensityMode, event: MouseEvent): void {
    if (eventCameFromToggle(event)) {
      return;
    }

    this.tailwindDensity.set(value);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
