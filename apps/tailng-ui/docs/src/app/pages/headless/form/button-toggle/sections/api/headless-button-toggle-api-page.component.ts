import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-button-toggle-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './headless-button-toggle-api-page.component.html',
  styleUrl: './headless-button-toggle-api-page.component.css',
})
export class HeadlessButtonToggleApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly groupAttachmentCode = [
    '<div',
    '  tngButtonToggleGroup',
    '  type="single"',
    '  [tngButtonToggleValue]="density()"',
    '  (valueChange)="onDensityChange($event)"',
    '>',
    '  <button tngButtonToggle tngButtonToggleValue="compact">Compact</button>',
    '  <button tngButtonToggle tngButtonToggleValue="comfortable">Comfortable</button>',
    '</div>',
    '',
  ].join('\n');

  protected readonly itemAttachmentCode = [
    '<button',
    '  tngButtonToggle',
    '  tngButtonToggleValue="bold"',
    '>',
    '  Bold',
    '</button>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
