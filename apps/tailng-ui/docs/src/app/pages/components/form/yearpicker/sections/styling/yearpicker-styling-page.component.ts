import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-yearpicker-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './yearpicker-styling-page.component.html',
  styleUrl: './yearpicker-styling-page.component.css',
})
export class YearpickerStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly themeAwareShellCode = [
    '.theme-aware-yearpicker-shell {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  color: var(--tng-semantic-foreground-primary);',
    '  background: var(--tng-semantic-background-surface);',
    '}',
    '',
  ].join('\n');

  protected readonly compactThemeCode = [
    '.compact-yearpicker {',
    '  --tng-datepicker-radius: 0.7rem;',
    '  --tng-datepicker-field-height: 2.6rem;',
    '  --tng-datepicker-overlay-padding: 0.6rem;',
    '  --tng-datepicker-grid-gap: 0.2rem;',
    '  --tng-datepicker-picker-cell-size: 2.1rem;',
    '  --tng-datepicker-brand: var(--tng-semantic-accent-brand);',
    '  --tng-datepicker-focus: var(--tng-semantic-focus-ring);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
