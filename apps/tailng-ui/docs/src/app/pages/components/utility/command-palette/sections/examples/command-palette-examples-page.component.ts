import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonComponent,
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
  selector: 'app-command-palette-examples-page',
  imports: [
    TngButtonComponent,
    TngCommandPaletteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './command-palette-examples-page.component.html',
  styleUrl: './command-palette-examples-page.component.css',
})
export class CommandPaletteExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly defaultOpen = signal(false);
  protected readonly defaultQuery = signal('');
  protected readonly defaultSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly defaultResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.defaultQuery()),
  );

  protected readonly customOpen = signal(false);
  protected readonly customQuery = signal('');
  protected readonly customSelected = signal<CommandPaletteDevice | null>(null);
  protected readonly customResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.customQuery()),
  );

  protected readonly getDeviceValue = (device: CommandPaletteDevice): string => device.id;
  protected readonly getDeviceLabel = (device: CommandPaletteDevice): string => device.label;
  protected readonly getDeviceDescription = (device: CommandPaletteDevice): string =>
    device.description;

  protected readonly defaultTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'ts',
      label: 'TS',
      language: 'ts',
      title: 'command-palette-default.component.ts',
      code: [
        "import { Component, computed, signal } from '@angular/core';",
        "import { TngCommandPaletteComponent } from '@tailng-ui/components';",
        '',
        '@Component({',
        "  selector: 'app-command-palette-default',",
        '  standalone: true,',
        '  imports: [TngCommandPaletteComponent],',
        "  templateUrl: './command-palette-default.component.html',",
        '})',
        'export class CommandPaletteDefaultComponent {',
        '  protected readonly open = signal(false);',
        "  protected readonly query = signal('');",
        '  protected readonly options = computed(() => filterDevices(this.query()));',
        '}',
      ].join('\n'),
    },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-default.component.html',
      code: [
        '<button type="button" (click)="open.set(true)">Search devices</button>',
        '<tng-command-palette',
        '  [open]="open()"',
        '  [query]="query()"',
        '  [options]="options()"',
        '  placeholder="Search devices..."',
        '  (openChange)="open.set($event)"',
        '  (queryChange)="query.set($event)"',
        '  (optionSelect)="selectDevice($event)"',
        '/>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly customTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'command-palette-custom.component.html',
      code: [
        '<tng-command-palette [open]="open()" [query]="query()" [options]="options()">',
        '  <ng-template #tngCommandPaletteInputPrefixTpl>',
        '    <span aria-hidden="true">⌘K</span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteOptionTpl let-item>',
        '    <span class="device-row">',
        '      <strong>{{ item.label }}</strong>',
        '      <span>{{ item.status }}</span>',
        '    </span>',
        '  </ng-template>',
        '',
        '  <ng-template #tngCommandPaletteFooterTpl>',
        '    Arrows move · Enter opens · Esc closes',
        '  </ng-template>',
        '</tng-command-palette>',
        '',
      ].join('\n'),
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: 'command-palette-custom.component.css',
      code: [
        '.device-row {',
        '  display: flex;',
        '  justify-content: space-between;',
        '  gap: 1rem;',
        '}',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onDefaultSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.defaultSelected.set(event.option);
  }

  protected onCustomSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.customSelected.set(event.option);
  }
}
