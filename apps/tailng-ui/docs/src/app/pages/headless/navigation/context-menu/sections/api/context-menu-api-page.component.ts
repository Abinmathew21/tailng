import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-context-menu-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './context-menu-api-page.component.html',
  styleUrls: ['./context-menu-api-page.component.css'],
})
export class HeadlessContextMenuApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly compositionCode = [
    '<div class="context-shell">',
    '  <div tabindex="0" [tngContextMenuTrigger]="assetMenu">Right-click target</div>',
    '  <div tngMenu tngContextMenu #assetMenu="tngContextMenu" aria-label="Asset actions">',
    '    <button type="button" tngMenuItem tngMenuItemValue="rename">Rename</button>',
    '  </div>',
    '</div>',
    '',
  ].join('\n');

  protected readonly keyboardContractCode = [
    'Target',
    '  Shift + F10 / ContextMenu : open from the focused target',
    '  Escape                    : close if open',
    '',
    'Open menu',
    '  ArrowDown / ArrowUp       : move active item',
    '  Home / End                : jump to first / last enabled item',
    '  Enter / Space             : activate current item',
    '  Escape                    : close and restore focus to the target',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
