import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngProgressSpinner } from '@tailng-ui/components';
import { TngProgressSpinner as TngProgressSpinnerPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-progress-spinner-playground-page',
  imports: [RouterLink, TngProgressSpinnerPrimitive, TngProgressSpinner],
  templateUrl: './progress-spinner-playground-page.component.html',
  styleUrl: './progress-spinner-playground-page.component.css',
})
export class ProgressSpinnerPlaygroundPageComponent {
  protected readonly completion = 42;
}
