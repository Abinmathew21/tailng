import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-toggle-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-toggle-api-page.component.html',
  styleUrl: './headless-toggle-api-page.component.css',
})
export class HeadlessToggleApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly toggleAttachmentCode = [
    '<button',
    '  tngToggle',
    '  [pressed]="showGrid()"',
    '  ariaLabel="Grid view"',
    '  (pressedChange)="showGrid.set($event)"',
    '>',
    '  Grid',
    '</button>',
    '',
  ].join('\n');

  protected readonly groupAttachmentCode = [
    '<div',
    '  tngToggleGroup',
    '  selectionMode="single"',
    '  ariaLabel="View mode"',
    '  [value]="viewMode()"',
    '  (valueChange)="onViewModeChange($event)"',
    '>',
    '  <button tngToggle tngToggleValue="grid">Grid</button>',
    '  <button tngToggle tngToggleValue="list">List</button>',
    '  <button tngToggle tngToggleValue="split">Split</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly changeHandlingCode = [
    "import { signal } from '@angular/core';",
    '',
    "type ToggleViewMode = 'grid' | 'list' | 'split';",
    '',
    "readonly viewMode = signal<ToggleViewMode>('grid');",
    '',
    'function onViewModeChange(value: string | null): void {',
    "  if (value === 'grid' || value === 'list' || value === 'split') {",
    '    viewMode.set(value);',
    '  }',
    '}',
    '',
    'function onBoldPressedChange(nextPressed: boolean): void {',
    '  boldEnabled.set(nextPressed);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
