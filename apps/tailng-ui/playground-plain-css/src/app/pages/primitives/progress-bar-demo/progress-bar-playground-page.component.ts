import { Component } from '@angular/core';
import { TngProgressBar } from '@tailng-ui/components';
import {
  TngProgressBar as TngProgressBarPrimitive,
  TngProgressBarIndicator as TngProgressBarIndicatorPrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-progress-bar-playground-page',
  imports: [
    TngProgressBarPrimitive,
    TngProgressBarIndicatorPrimitive,
    TngProgressBar,
  ],
  templateUrl: './progress-bar-playground-page.component.html',
  styleUrl: './progress-bar-playground-page.component.css',
})
export class ProgressBarPlaygroundPageComponent {
  protected readonly completion = 68;
}
