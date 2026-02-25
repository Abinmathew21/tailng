import { Component } from '@angular/core';
import { TngButtonComponent } from '@tailng-ui/components';
import { TngButton as TngButtonPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-button-playground-page',
  imports: [TngButtonPrimitive, TngButtonComponent],
  templateUrl: './button-playground-page.component.html',
  styleUrl: './button-playground-page.component.css',
})
export class ButtonPlaygroundPageComponent {}
