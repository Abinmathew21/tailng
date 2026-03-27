import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-empty-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './empty-styling-page.component.html',
  styleUrl: './empty-styling-page.component.css',
})
export class EmptyStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly cssContractCode = [
    '[data-slot="empty"] {',
    '  border: 1px dashed var(--tng-semantic-border-strong);',
    '  border-radius: 1rem;',
    '  display: grid;',
    '  gap: 0.75rem;',
    '  justify-items: center;',
    '  padding: 1.5rem;',
    '}',
    '',
    '[data-slot="empty"][data-align="start"] {',
    '  justify-items: start;',
    '  text-align: left;',
    '}',
    '',
    '[data-slot="empty-icon"] {',
    '  color: var(--tng-semantic-foreground-muted);',
    '  font-size: 1.75rem;',
    '}',
    '',
    '[data-slot="empty-actions"] {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.5rem;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
