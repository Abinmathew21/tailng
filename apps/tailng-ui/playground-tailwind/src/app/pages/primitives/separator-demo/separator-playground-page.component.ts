import { Component } from '@angular/core';
import { TngSeparator } from '@tailng-ui/components';
import { TngSeparator as TngSeparatorPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-separator-playground-page',
  imports: [TngSeparatorPrimitive, TngSeparator],
  templateUrl: './separator-playground-page.component.html',
  styleUrl: './separator-playground-page.component.css',
})
export class SeparatorPlaygroundPageComponent {}
