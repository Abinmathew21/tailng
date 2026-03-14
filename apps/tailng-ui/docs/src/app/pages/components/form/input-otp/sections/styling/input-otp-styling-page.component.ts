import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-otp-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-otp-styling-page.component.html',
  styleUrl: './input-otp-styling-page.component.css',
})
export class InputOtpStylingPageComponent {
  protected readonly stylingExampleCode = [
    '.project-otp [data-slot="input-otp"] {',
    '  display: inline-flex;',
    '  gap: 0.5rem;',
    '}',
    '',
    '.project-otp .tng-input-otp-slot {',
    '  border: 1px solid var(--tng-semantic-border-subtle);',
    '  border-radius: 0.6rem;',
    '  block-size: 2.5rem;',
    '  inline-size: 2.35rem;',
    '  text-align: center;',
    '}',
    '',
    '.project-otp [data-slot="input-otp"][data-focus-visible] .tng-input-otp-slot[data-tng-otp-slot="2"] {',
    '  border-color: var(--tng-semantic-accent-brand);',
    '}',
    '',
    '.project-otp [data-slot="input-otp"][data-invalid] .tng-input-otp-slot {',
    '  border-color: var(--tng-semantic-accent-danger);',
    '}',
    '',
  ].join('\n');
}
