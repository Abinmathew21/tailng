import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { TngIcon } from '@tailng-ui/icons';
import { DocsGlobalSearchDialogComponent } from '../dialog/docs-global-search-dialog.component';

@Component({
  imports: [DocsGlobalSearchDialogComponent, TngIcon],
  selector: 'app-docs-global-search',
  templateUrl: './docs-global-search.component.html',
  styleUrl: './docs-global-search.component.css',
})
export class DocsGlobalSearchComponent {
  private readonly documentRef = inject(DOCUMENT);

  protected readonly searchOpen = signal(false);
  protected readonly searchInitialValue = signal('');

  protected readonly searchShortcutHint = computed<string>(() =>
    this.isMacPlatform() ? '⌘K' : 'Ctrl K',
  );

  @HostListener('document:keydown', ['$event'])
  public onDocumentKeydown(event: KeyboardEvent): void {
    const shortcutPressed = this.isMacPlatform() ? event.metaKey : event.ctrlKey;
    if (event.key.toLowerCase() !== 'k' || !shortcutPressed) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.openSearch();
  }

  protected openSearch(initialValue = ''): void {
    this.searchInitialValue.set(initialValue);
    this.searchOpen.set(true);
  }

  protected onSearchButtonKeydown(event: KeyboardEvent): void {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();
    this.openSearch(event.key.trim());
  }

  protected onSearchOpenChange(open: boolean): void {
    this.searchOpen.set(open);

    if (!open) {
      this.searchInitialValue.set('');
    }
  }

  protected onSearchClosed(): void {
    this.searchInitialValue.set('');
    this.searchOpen.set(false);
  }

  private isMacPlatform(): boolean {
    const navigatorRef = this.documentRef.defaultView?.navigator;
    return navigatorRef?.platform.toLowerCase().includes('mac') ?? false;
  }
}
