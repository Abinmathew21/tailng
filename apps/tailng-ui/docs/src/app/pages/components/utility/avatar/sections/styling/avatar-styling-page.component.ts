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
    '.docs-avatar[data-size="lg"] {',
    '  height: 3rem;',
    '  width: 3rem;',
    '}',
    '',
    '.docs-avatar[data-shape="square"] {',
    '  border-radius: 0.75rem;',
    '}',
    '',
    '.docs-avatar [data-slot="avatar-fallback"] {',
    '  background: color-mix(in srgb, var(--tng-semantic-accent-brand) 10%, transparent);',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
