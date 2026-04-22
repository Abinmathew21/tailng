import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-avatar-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './avatar-styling-page.component.html',
  styleUrl: './avatar-styling-page.component.css',
})
export class AvatarStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly contractCss = [
    'tng-avatar > .tng-avatar[data-size="lg"] {',
    '  box-shadow: 0 0 0 4px color-mix(in srgb, var(--tng-semantic-accent-brand) 12%, transparent);',
    '}',
    '',
    'tng-avatar > .tng-avatar[data-shape="square"] {',
    '  border-radius: 1rem;',
    '}',
    '',
    'tng-avatar > .tng-avatar [data-slot="avatar-fallback"] {',
      '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
