import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-api-page.component.html',
  styleUrl: './input-api-page.component.css',
})
export class InputApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly componentTemplateCode = [
    '<tng-input type="email" placeholder="team@tailng.dev"></tng-input>',
    '',
  ].join('\n');

  protected readonly formFieldTemplateCode = [
    '<tng-form-field>',
    '  <span tngPrefix aria-hidden="true">Search</span>',
    '  <input tngInput type="search" placeholder="Search docs" />',
    '  <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '</tng-form-field>',
    '',
  ].join('\n');

  protected readonly directiveAttachCode = [
    '<input tngInput type="text" />',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
