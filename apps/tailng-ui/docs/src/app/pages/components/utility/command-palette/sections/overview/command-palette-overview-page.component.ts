import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngButtonComponent,
  TngCodeBlockComponent,
  TngCommandPaletteComponent,
  type TngCommandPaletteOptionSelect,
} from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import {
  COMMAND_PALETTE_DEVICES,
  filterCommandPaletteDevices,
  type CommandPaletteDevice,
} from '../../command-palette.util';

@Component({
  selector: 'app-command-palette-overview-page',
  imports: [TngButtonComponent, TngCodeBlockComponent, TngCommandPaletteComponent],
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

  protected readonly searchOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly selectedDevice = signal<CommandPaletteDevice | null>(null);
  protected readonly searchResults = computed(() =>
    filterCommandPaletteDevices(COMMAND_PALETTE_DEVICES, this.searchQuery()),
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

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onDeviceSelect(
    event: TngCommandPaletteOptionSelect<CommandPaletteDevice, unknown>,
  ): void {
    this.selectedDevice.set(event.option);
  }
}
