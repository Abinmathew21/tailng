import { Component, signal } from '@angular/core';
import { TngInputOtp } from '@tailng-ui/components';
import { TngInputOtp as TngInputOtpPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-otp-playground-page',
  imports: [TngInputOtpPrimitive, TngInputOtp],
  templateUrl: './input-otp-playground-page.component.html',
  styleUrl: './input-otp-playground-page.component.css',
})
export class InputOtpPlaygroundPageComponent {
  protected readonly otpValue = signal('');
  protected readonly completionValue = signal('');

  protected onComplete(value: string): void {
    this.completionValue.set(value);
  }

  protected onOtpValueChange(value: string): void {
    this.otpValue.set(value);
  }
}
