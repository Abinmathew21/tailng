import { Component } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngPress as TngPressPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-button-playground-page',
  imports: [TngPressPrimitive, TngButtonComponent],
  templateUrl: './button-playground-page.component.html',
  styleUrl: './button-playground-page.component.css',
})
export class ButtonPlaygroundPageComponent {}
