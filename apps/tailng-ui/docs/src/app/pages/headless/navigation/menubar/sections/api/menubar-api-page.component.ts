import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-menubar-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './menubar-api-page.component.html',
  styleUrls: ['./menubar-api-page.component.css'],
})
export class HeadlessMenubarApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly compositionCode = [
    '<div tngMenubar aria-label="Workspace commands">',
    '  <div class="menubar-item-shell">',
    '    <div tngMenu #fileMenu="tngMenu" aria-label="File menu">',
    '      <button type="button" tngMenuItem tngMenuItemValue="Create document">New</button>',
    '    </div>',
    '    <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu">File</button>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly submenuCode = [
    '<div tngMenu #fileMenu="tngMenu" aria-label="File menu">',
    '  <button type="button" tngMenuItem [tngMenuItemSubmenu]="importMenu">Import…</button>',
    '',
    '  <div tngMenu #importMenu="tngMenu" aria-label="Import submenu">',
    '    <button type="button" tngMenuItem tngMenuItemValue="Import from CSV">CSV file</button>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly keyboardContractCode = [
    'ArrowLeft / ArrowRight  Move across top-level menubar items',
    'ArrowDown               Open owned menu and focus first enabled item',
    'Home / End              Jump to first / last enabled top-level item',
    'Escape                  Close menu and restore focus to owning trigger',
    'Printable key           Typeahead across enabled top-level item labels',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
