import { Component } from '@angular/core';
import { TngSeparatorComponent } from '@tailng-ui/components';
import { TngSeparator as TngSeparatorPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-separator-playground-page',
  imports: [TngSeparatorPrimitive, TngSeparatorComponent],
  templateUrl: './separator-playground-page.component.html',
  styleUrl: './separator-playground-page.component.css',
})
export class SeparatorPlaygroundPageComponent {}
