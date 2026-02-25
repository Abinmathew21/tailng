import { Component, signal } from '@angular/core';
import { TngLabelComponent } from '@tailng-ui/components';
import { TngLabel } from '@tailng-ui/primitives';

@Component({
  selector: 'app-label-playground-page',
  imports: [TngLabelComponent, TngLabel],
  templateUrl: './label-playground-page.component.html',
  styleUrl: './label-playground-page.component.css',
})
export class LabelPlaygroundPageComponent {
  public readonly componentRequired = signal(true);

  public onToggleRequired(): void {
    this.componentRequired.set(!this.componentRequired());
  }
}
