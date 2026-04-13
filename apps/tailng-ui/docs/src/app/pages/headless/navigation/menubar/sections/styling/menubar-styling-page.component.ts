import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-menubar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './menubar-styling-page.component.html',
  styleUrls: ['./menubar-styling-page.component.css'],
})
export class HeadlessMenubarStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly contractCode = [
    "[data-slot='menubar'] {",
    '  display: inline-flex;',
    '  gap: 0.35rem;',
    '  padding: var(--tng-menubar-padding, 0.3rem);',
    '  border-radius: var(--tng-menubar-radius, 0.9rem);',
    '}',
    '',
    "[data-slot='menubar-item'] {",
    '  padding-inline: var(--tng-menubar-item-px, 0.85rem);',
    '}',
    '',
    "[data-slot='menubar-item'][aria-expanded='true'] {",
    '  background: color-mix(in srgb, var(--tng-menubar-brand) 14%, var(--tng-menubar-bg));',
    '}',
    '',
  ].join('\n');

  protected readonly stateSelectorCode = [
    ".docs-menubar-shell [data-slot='menubar-item'][tabindex='0'] {",
    '  box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.24);',
    '  background: rgba(37, 99, 235, 0.12);',
    '}',
    '',
    ".docs-menubar-panel [tngMenuItem][data-active] {",
    '  color: #1d4ed8;',
    '  background: rgba(37, 99, 235, 0.16);',
    '}',
    '',
    ".docs-menubar-panel [tngMenuItem][aria-disabled='true'] {",
    '  opacity: 0.5;',
    '  cursor: not-allowed;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
