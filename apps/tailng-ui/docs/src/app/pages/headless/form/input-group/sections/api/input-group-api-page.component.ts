import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-input-group-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-group-api-page.component.html',
  styleUrls: [
    '../../../input/sections/api/headless-input-api-page.component.css',
    '../../../../../../shared/form/input/input-styles.css',
  ],
})
export class HeadlessInputGroupApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly groupTemplateCode = [
    '<tng-input-group>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs..." />',
    '  <button tngSuffix type="button" aria-label="Clear search">Clear</button>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly projectedControlCode = [
    '<tng-input-group>',
    '  <input tngInput type="text" />',
    '</tng-input-group>',
    '',
    '<tng-input-group>',
    '  <textarea tngTextarea rows="4"></textarea>',
    '</tng-input-group>',
    '',
  ].join('\n');

  protected readonly stateSelectorCode = [
    ".docs-search-shell[data-slot='input-group'][data-focused] {",
    '  border-color: #3b82f6;',
    '  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);',
    '}',
    '',
    ".docs-search-shell[data-slot='input-group'][data-invalid] {",
    '  border-color: #dc2626;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
