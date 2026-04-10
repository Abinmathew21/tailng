import { Component } from '@angular/core';
import { DocsOwnableInstallSectionComponent } from '../../../../shared/ownable-install-section/docs-ownable-install-section.component';

@Component({
  selector: 'app-ownable-input-otp-page',
  imports: [DocsOwnableInstallSectionComponent],
  templateUrl: './ownable-input-otp-page.component.html',
})
export class OwnableInputOtpPageComponent {
  protected readonly usageCode = [
    '<tng-input-otp',
    '  [length]="6"',
    '  [ariaLabel]="\'Verification code\'"',
    '  (complete)="onVerificationComplete($event)"',
    '></tng-input-otp>',
    '',
  ].join('\n');
}
