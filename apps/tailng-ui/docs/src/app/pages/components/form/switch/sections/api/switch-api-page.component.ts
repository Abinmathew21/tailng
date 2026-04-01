import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-switch-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './switch-api-page.component.html',
  styleUrl: './switch-api-page.component.css',
})
export class SwitchApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly primitiveAttachmentCode = [
    '<button',
    '  tngSwitch',
    '  [checked]="releaseReady()"',
    '  ariaLabel="Release ready"',
    '  (click)="releaseReady.update(value => !value)"',
    '>',
    '  <span class="switch-thumb" aria-hidden="true"></span>',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-switch',
    '  [checked]="releaseReady()"',
    '  (checkedChange)="releaseReady.set($event)"',
    '>',
    '  Release ready',
    '</tng-switch>',
    '',
  ].join('\n');

  protected readonly nativeFormCode = [
    '<form>',
    '  <tng-switch name="autoPublish" value="enabled" [checked]="true">',
    '    Auto publish after review',
    '  </tng-switch>',
    '</form>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
