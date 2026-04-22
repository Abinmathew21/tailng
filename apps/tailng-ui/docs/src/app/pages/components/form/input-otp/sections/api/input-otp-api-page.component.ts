import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-input-otp-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-otp-api-page.component.html',
  styleUrl: './input-otp-api-page.component.css',
})
export class InputOtpApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly wrapperUsageCode = String.raw`<tng-input-otp
  [length]="6"
  [value]="verificationCode()"
  [type]="'numeric'"
  [required]="true"
  [ariaLabel]="'Verification code'"
  (valueChange)="onVerificationCodeChange($event)"
  (complete)="onVerificationCodeComplete($event)"
></tng-input-otp>`;

  protected readonly formsCode = String.raw`import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

readonly verificationForm = new FormGroup({
  otp: new FormControl('', { nonNullable: true }),
});

<tng-input-otp formControlName="otp"></tng-input-otp>`;

  protected readonly signalFormsCode = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-verification-code-signal-form',
  standalone: true,
  imports: [FormField, TngInputOtpComponent],
  template: \`
    <tng-input-otp
      [length]="6"
      [formField]="verificationForm.code"
      ariaLabel="Verification code"
    ></tng-input-otp>
  \`,
})
export class VerificationCodeSignalFormComponent {
  readonly verificationModel = signal({ code: '' });
  readonly verificationForm = form(this.verificationModel);
}`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
