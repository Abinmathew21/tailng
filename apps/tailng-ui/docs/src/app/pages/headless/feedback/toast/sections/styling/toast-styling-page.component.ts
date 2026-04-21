import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-toast-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toast-styling-page.component.html',
  styleUrl: './toast-styling-page.component.css',
})
export class HeadlessToastStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stateHooksCode = [
    '[data-slot="toast-viewport"] {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '}',
    '',
    '[data-slot="toast-item"][data-tone="success"] {',
    '  border-color: var(--tng-semantic-accent-success);',
    '}',
    '',
    '[data-slot="toast-item"][data-tone="danger"] {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
    '[data-slot="toast-item"][data-state="closed"],',
    '[data-slot="toast-item"][hidden] {',
    '  display: none !important;',
    '}',
    '',
  ].join('\n');

  protected readonly starterCssCode = [
    '.release-toast-stack {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  position: fixed;',
    '  right: 1rem;',
    '  top: 1rem;',
    '  width: min(24rem, calc(100vw - 2rem));',
    '}',
    '',
    '.release-toast-card {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-default);',
    '  border-radius: 0.85rem;',
    '  box-shadow: 0 16px 30px color-mix(in srgb, var(--tng-semantic-foreground-primary) 18%, transparent);',
    '  color: var(--tng-semantic-foreground-primary);',
    '  display: grid;',
    '  gap: 0.35rem;',
    '  padding: 0.8rem 0.85rem;',
    '}',
    '',
    '.release-toast-card strong {',
    '  font-size: 0.78rem;',
    '  letter-spacing: 0.16em;',
    '  text-transform: uppercase;',
    '}',
    '',
    '.release-toast-card p {',
    '  color: var(--tng-semantic-foreground-secondary);',
    '  line-height: 1.45;',
    '  margin: 0;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
