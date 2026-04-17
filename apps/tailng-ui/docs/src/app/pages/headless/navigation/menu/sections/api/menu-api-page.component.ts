import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-menu-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './menu-api-page.component.html',
  styleUrls: ['./menu-api-page.component.css'],
})
export class HeadlessMenuApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly compositionCode = [
    '<div class="menu-shell">',
    '  <button type="button" [tngMenuTrigger]="apiCompositionFileMenu">File</button>',
    '  <div tngMenu #apiCompositionFileMenu="tngMenu" aria-label="File menu">',
    '    <button type="button" tngMenuItem tngMenuItemValue="new">New</button>',
    '    <button type="button" tngMenuItem tngMenuItemValue="open">Open</button>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly submenuCode = [
    '<div tngMenu #apiRootMenu="tngMenu" aria-label="Actions">',
    '  <button type="button" tngMenuItem [tngMenuItemSubmenu]="apiImportMenu">Import…</button>',
    '',
    '  <div tngMenu #apiImportMenu="tngMenu" aria-label="Import sources">',
    '    <button type="button" tngMenuItem tngMenuItemValue="csv">CSV</button>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly backdropCode = [
    '<section class="menu-with-backdrop">',
    '  <button type="button" [tngMenuTrigger]="apiBackdropPanel">Open</button>',
    '  <div [tngMenuBackdrop]="apiBackdropPanel" class="menu-backdrop" aria-hidden="true"></div>',
    '  <div tngMenu #apiBackdropPanel="tngMenu" aria-label="Actions">',
    '    <button type="button" tngMenuItem tngMenuItemValue="save">Save</button>',
    '  </div>',
    '</section>',
    '',
  ].join('\n');

  protected readonly tokenCode = [
    "import { TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    '  providers: [{ provide: TNG_MENU_DEFER_HOST_FOCUS_UNTIL_POSITIONED, useValue: true }],',
    '  // ...',
    '})',
    'export class MenuWithDeferredFocusComponent {}',
    '',
  ].join('\n');

  protected readonly keyboardContractCode = [
    'Trigger (tngMenuTrigger)',
    '  Enter / Space       Toggle open; focus stays on trigger when closed',
    '  ArrowDown           Open and focus first enabled item',
    '  ArrowUp             Open and focus last enabled item',
    '  Escape              Close when open',
    '',
    'Open menu panel',
    '  ArrowDown / ArrowUp Move active item (respects loop)',
    '  Home / End          Jump to first / last enabled item',
    '  Typeahead           Matches visible item labels',
    '  Enter / Space       Activate focused item (emits tngMenuSelect when applicable)',
    '  Escape              Close; nested submenu closes before root',
    '',
    'Submenus',
    '  ArrowRight          Open owned submenu',
    '  ArrowLeft           Close nested panel; focus returns to parent item',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
