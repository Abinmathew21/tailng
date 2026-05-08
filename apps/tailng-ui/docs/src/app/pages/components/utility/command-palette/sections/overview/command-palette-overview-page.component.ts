import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonComponent,
  TngCodeBlockComponent,
  TngCommandPaletteComponent,
  type TngCommandPaletteOptionSelect,
} from '@tailng-ui/components';
import { type DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  COMMAND_PALETTE_DEVICES,
  filterCommandPaletteDevices,
  type CommandPaletteDevice,
} from '../../command-palette.util';

@Component({
  selector: 'app-command-palette-overview-page',
  imports: [
    TngButtonComponent,
    TngCodeBlockComponent,
    TngCommandPaletteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './command-palette-overview-page.component.html',
  styleUrl: './command-palette-overview-page.component.css',
})
export class CommandPaletteOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainOpen = signal(false);
  protected readonly plainQuery = signal('');
  protected readonly plainSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly plainResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.plainQuery()),
  );

  protected readonly tailwindOpen = signal(false);
  protected readonly tailwindQuery = signal('');
  protected readonly tailwindSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly tailwindResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.tailwindQuery()),
  );

  protected readonly componentImportCode = [
    "import { TngCommandPaletteComponent } from '@tailng-ui/components';",
    '',
  ].join('\n');

  protected readonly componentUsageCode = [
    '<tng-command-palette',
    '  [open]="searchOpen()"',
    '  [query]="searchQuery()"',
    '  [options]="searchResults()"',
    '  placeholder="Search devices..."',
    '  (openChange)="searchOpen.set($event)"',
    '  (queryChange)="searchQuery.set($event)"',
    '  (optionSelect)="onDeviceSelect($event)"',
    '/>',
    '',
  ].join('\n');

  protected readonly plainCssCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-overview-plain-css.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngButtonComponent, TngCommandPaletteComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-command-palette-overview-plain-css',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-overview-plain-css.component.html',",
        "  styleUrl: './command-palette-overview-plain-css.component.css',",
        '})',
        'export class CommandPaletteOverviewPlainCssComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly selected = signal<string | null>(null);',
        '  protected readonly results = computed(() => filterDevices(this.query()));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-overview-plain-css.component.html',
      code: [
        '<div class="command-palette-overview-preview command-palette-overview-preview--plain">',
        '  <tng-button type="button" appearance="outline" tone="neutral" (click)="open.set(true)">',
        '    Open command palette',
        '  </tng-button>',
        '  @if (selected(); as device) {',
        '    <p class="command-palette-overview-selected">Selected: {{ device }}</p>',
        '  }',
        '</div>',
        '',
        '<tng-command-palette',
        '  class="command-palette-overview-overlay"',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [options]="results()"',
        '  placeholder="Search devices..."',
        '  (openChange)="open.set($event)"',
        '  (queryChange)="query.set($event)"',
        '  (optionSelect)="selected.set($event.option.label)"',
        '/>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-overview-plain-css.component.css',
      code: [
        '.command-palette-overview-preview--plain {',
        '  align-items: center;',
        '  display: flex;',
        '  flex-wrap: wrap;',
        '  gap: 0.85rem;',
        '}',
        '',
        '.command-palette-overview-overlay {',
        '  --tng-z-overlay: 1200;',
        '}',
      ].join('\n'),
    },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-overview-tailwind.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngButtonComponent, TngCommandPaletteComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-command-palette-overview-tailwind',",
        '  standalone: true,',
        '  imports: [TngButtonComponent, TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-overview-tailwind.component.html',",
        '})',
        'export class CommandPaletteOverviewTailwindComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly selected = signal<string | null>(null);',
        '  protected readonly results = computed(() => filterDevices(this.query()));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-overview-tailwind.component.html',
      code: [
        '<div class="rounded-2xl border border-[var(--tng-semantic-border-subtle)] bg-[color-mix(in_srgb,var(--tng-semantic-background-surface)_88%,transparent)] p-4">',
        '  <div class="flex flex-wrap items-center gap-3">',
        '    <tng-button type="button" appearance="solid" tone="primary" (click)="open.set(true)">',
        '      Open custom palette',
        '    </tng-button>',
        '    @if (selected(); as device) {',
        '      <p class="text-sm text-[var(--tng-semantic-foreground-secondary)]">Selected: {{ device }}</p>',
        '    }',
        '  </div>',
        '</div>',
        '',
        '<tng-command-palette',
        '  class="command-palette-overview-overlay"',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [options]="results()"',
        '  placeholder="Search devices..."',
        '  (openChange)="open.set($event)"',
        '  (queryChange)="query.set($event)"',
        '  (optionSelect)="selected.set($event.option.label)"',
        '>',
        '  <ng-template #tngCommandPaletteOptionTpl let-item>',
        '    <span class="flex items-center justify-between gap-4 min-w-0">',
        '      <span class="min-w-0">',
        '        <strong class="block truncate">{{ item.label }}</strong>',
        '        <small class="block text-[var(--tng-semantic-foreground-secondary)]">{{ item.description }}</small>',
        '      </span>',
        '      <span class="rounded-full border border-[var(--tng-semantic-border-subtle)] px-2 py-0.5 text-xs text-[var(--tng-semantic-foreground-secondary)]">{{ item.status }}</span>',
        '    </span>',
        '  </ng-template>',
        '</tng-command-palette>',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-overview-tailwind.component.css',
      code: '/* Tailwind utilities are applied directly in the template. */',
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onPlainSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.plainSelected.set(event.option);
  }

  protected onTailwindSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.tailwindSelected.set(event.option);
  }
}
