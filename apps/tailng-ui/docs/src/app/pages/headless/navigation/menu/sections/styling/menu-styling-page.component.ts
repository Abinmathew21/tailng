import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-menu-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './menu-styling-page.component.html',
  styleUrls: ['./menu-styling-page.component.css'],
})
export class HeadlessMenuStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCode = [
    "[data-slot='menu-trigger'],",
    "[data-slot='menu'][aria-labelledby] {",
    '  --tng-menu-radius: 0.75rem;',
    '  --tng-menu-padding: 0.4rem;',
    '  --tng-menu-item-py: 0.5rem;',
    '  --tng-menu-item-px: 0.75rem;',
    '  --tng-menu-border: var(--tng-semantic-border-subtle, #e5e7eb);',
    '  --tng-menu-brand: var(--tng-semantic-accent-brand, #2563eb);',
    '  --tng-menu-shadow:',
    '    0 12px 24px -12px rgba(15, 23, 42, 0.22),',
    '    0 18px 40px -18px rgba(15, 23, 42, 0.18);',
    '}',
    '',
    "[data-slot='menu'][data-state='open'] {",
    '  border-radius: var(--tng-menu-radius);',
    '  box-shadow: var(--tng-menu-shadow);',
    '}',
    '',
  ].join('\n');

  protected readonly stateSelectorCode = [
    "[data-slot='menu-trigger'][aria-expanded='true'] {",
    '  border-color: var(--tng-menu-brand);',
    '}',
    '',
    "[data-slot='menu-item'][data-active],",
    "[data-slot='menu-item'][aria-expanded='true'] {",
    '  color: #1d4ed8;',
    '  background: rgba(37, 99, 235, 0.16);',
    '}',
    '',
    "[data-slot='menu-item'][aria-disabled='true'] {",
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
