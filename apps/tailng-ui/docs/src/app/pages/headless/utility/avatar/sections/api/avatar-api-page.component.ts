import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-avatar-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './avatar-api-page.component.html',
  styleUrl: './avatar-api-page.component.css',
})
export class HeadlessAvatarApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly selectorCode = [
    '<span tngAvatar></span>',
    '<img tngAvatarImage />',
    '<span tngAvatarFallback></span>',
    '',
  ].join('\n');

  protected readonly ownerCode = [
    'protected readonly src = signal<string | null>(profileUrl);',
    'protected readonly imageLoadFailed = signal(false);',
    '',
    'protected showFallback(): boolean {',
    '  return this.src() === null || this.imageLoadFailed();',
    '}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
