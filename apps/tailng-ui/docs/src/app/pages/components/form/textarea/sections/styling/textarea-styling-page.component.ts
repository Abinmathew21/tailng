import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-textarea-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './textarea-styling-page.component.html',
  styleUrl: './textarea-styling-page.component.css',
})
export class TextareaStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly tokenSnippet = [
    '.release-notes-surface {',
    '  --tng-semantic-background-surface: #ffffff;',
    '  --tng-semantic-border-strong: #94a3b8;',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-foreground-muted: #94a3b8;',
    '  --tng-semantic-focus-ring: color-mix(in srgb, #2563eb 18%, transparent);',
    '  --tng-semantic-accent-danger: #dc2626;',
    '}',
    '',
  ].join('\n');

  protected readonly hostSizingSnippet = [
    '.release-notes-surface {',
    '  display: grid;',
    '  gap: 0.65rem;',
    '  inline-size: min(100%, 42rem);',
    '  margin-inline: auto;',
    '}',
    '',
    '.release-notes-surface tng-textarea {',
    '  inline-size: 100%;',
    '}',
    '',
  ].join('\n');

  protected readonly componentStateSnippet = [
    '.release-notes-surface {',
    '  --tng-semantic-background-surface: #ffffff;',
    '  --tng-semantic-border-strong: #94a3b8;',
    '  --tng-semantic-foreground-primary: #0f172a;',
    '  --tng-semantic-foreground-muted: #94a3b8;',
    '  --tng-semantic-focus-ring: color-mix(in srgb, #2563eb 18%, transparent);',
    '  --tng-semantic-accent-danger: #dc2626;',
    '}',
    '',
    '.release-notes-surface--invalid {',
    '  --tng-semantic-border-strong: #dc2626;',
    '  --tng-semantic-focus-ring: color-mix(in srgb, #dc2626 16%, transparent);',
    '}',
    '',
    '.release-notes-surface--quiet {',
    '  --tng-semantic-background-surface: #f8fafc;',
    '  --tng-semantic-border-strong: #cbd5e1;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
