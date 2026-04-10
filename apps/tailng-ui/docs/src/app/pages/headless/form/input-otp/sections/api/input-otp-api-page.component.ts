import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-headless-input-otp-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-otp-api-page.component.html',
  styleUrl: './input-otp-api-page.component.css',
})
export class HeadlessInputOtpApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly primitiveUsageCode = String.raw`<div
  tngInputOtp
  [length]="6"
  [value]="verificationCode()"
  [disabled]="isDisabled()"
  [readonly]="isReadonly()"
  [invalid]="hasError()"
  [focused]="isFocused()"
  [focusVisible]="showFocusRing()"
  [activeIndex]="activeIndex()"
></div>`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
