import { Component } from '@angular/core';
import { TngButton } from '@tailng-ui/components';
import { TngPress as TngPressPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-button-playground-page',
  imports: [TngPressPrimitive, TngButton],
  templateUrl: './button-playground-page.component.html',
  styleUrl: './button-playground-page.component.css',
})
export class ButtonPlaygroundPageComponent {}
