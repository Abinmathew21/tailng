import { Component } from '@angular/core';
import { TngMenubarComponent } from '@tailng-ui/components';
import { TngMenubar as TngMenubarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-playground-page',
  imports: [TngMenubarPrimitive, TngMenubarComponent],
  templateUrl: './menubar-playground-page.component.html',
  styleUrl: './menubar-playground-page.component.css',
})
export class MenubarPlaygroundPageComponent {}
