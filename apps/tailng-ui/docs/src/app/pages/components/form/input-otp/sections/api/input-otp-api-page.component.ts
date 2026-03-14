import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-otp-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-otp-api-page.component.html',
  styleUrl: './input-otp-api-page.component.css',
})
export class InputOtpApiPageComponent {
  protected readonly primitiveAttachmentCode = [
    '<div tngInputOtp [length]="6" [value]="otpValue" [activeIndex]="activeIndex"></div>',
    '',
  ].join('\n');

  protected readonly wrapperAttachmentCode = [
    '<tng-input-otp',
    '  [length]="6"',
    '  [value]="otpValue"',
    '  [type]="\'numeric\'"',
    '  [required]="true"',
    '  [name]="\'verificationCode\'"',
    '  (valueChange)="otpValue = $event"',
    '  (complete)="onOtpComplete($event)"',
    '></tng-input-otp>',
    '',
  ].join('\n');

  protected readonly formsCode = [
    'const form = new FormGroup({',
    "  otp: new FormControl('', { nonNullable: true }),",
    '});',
    '',
    '<tng-input-otp formControlName="otp"></tng-input-otp>',
    '',
  ].join('\n');
}
