import { Component, signal } from '@angular/core';
import { TngSlider } from '@tailng-ui/components';
import { TngSlider as TngSliderPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-slider-playground-page',
  imports: [TngSliderPrimitive, TngSlider],
  templateUrl: './slider-playground-page.component.html',
  styleUrl: './slider-playground-page.component.css',
})
export class SliderPlaygroundPageComponent {
  protected readonly volume = signal(30);

  protected onVolumeChange(value: number): void {
    this.volume.set(value);
  }
}
