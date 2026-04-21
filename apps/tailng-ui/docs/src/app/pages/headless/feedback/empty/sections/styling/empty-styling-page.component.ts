import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-empty-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './empty-styling-page.component.html',
  styleUrl: './empty-styling-page.component.css',
})
export class HeadlessEmptyStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly slotHooksCode = [
    '[data-slot="empty"] {',
    '  display: grid;',
    '  gap: 0.75rem;',
    '}',
    '',
    '[data-slot="empty-icon"] {',
    '  font-size: 2rem;',
    '  line-height: 1;',
    '}',
    '',
    '[data-slot="empty-actions"] {',
    '  display: flex;',
    '  flex-wrap: wrap;',
    '  gap: 0.65rem;',
    '}',
    '',
  ].join('\n');

  protected readonly starterCssCode = [
    '.empty-state {',
    '  border: 1px dashed var(--tng-semantic-border-strong);',
    '  border-radius: 1rem;',
    '  justify-items: center;',
    '  padding: 1.5rem;',
    '  text-align: center;',
    '}',
    '',
    '.empty-state [data-slot="empty-title"] {',
    '  font-size: 1.05rem;',
    '  font-weight: 600;',
    '  margin: 0;',
    '}',
    '',
    '.empty-state [data-slot="empty-description"] {',
    '  color: var(--tng-semantic-foreground-muted);',
    '  line-height: 1.5;',
    '  margin: 0;',
    '  max-width: 32rem;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
