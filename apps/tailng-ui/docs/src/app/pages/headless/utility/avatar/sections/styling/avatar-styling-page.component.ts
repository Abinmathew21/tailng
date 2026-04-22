import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-avatar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './avatar-styling-page.component.html',
  styleUrl: './avatar-styling-page.component.css',
})
export class HeadlessAvatarStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly starterCode = [
    '.profile-avatar {',
    '  background: var(--tng-semantic-background-surface);',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 9999px;',
    '  display: inline-flex;',
    '  height: 2.75rem;',
    '  overflow: hidden;',
    '  position: relative;',
    '  width: 2.75rem;',
    '}',
    '',
    '.profile-avatar [data-slot="avatar-image"] {',
    '  height: 100%;',
    '  object-fit: cover;',
    '  width: 100%;',
    '}',
    '',
  ].join('\n');

  protected readonly sizingCode = [
    '.profile-avatar[data-size="sm"] {',
    '  height: 2rem;',
    '  width: 2rem;',
    '}',
    '',
    '.profile-avatar[data-shape="square"] {',
    '  border-radius: 0.75rem;',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
