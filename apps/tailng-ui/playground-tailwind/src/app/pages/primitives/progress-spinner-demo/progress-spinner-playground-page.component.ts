import { Component } from '@angular/core';
import { TngProgressSpinner } from '@tailng-ui/components';
import { TngProgressSpinner as TngProgressSpinnerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-progress-spinner-playground-page',
  imports: [TngProgressSpinnerPrimitive, TngProgressSpinner],
  templateUrl: './progress-spinner-playground-page.component.html',
  styleUrl: './progress-spinner-playground-page.component.css',
})
export class ProgressSpinnerPlaygroundPageComponent {
  protected readonly completion = 42;
}
