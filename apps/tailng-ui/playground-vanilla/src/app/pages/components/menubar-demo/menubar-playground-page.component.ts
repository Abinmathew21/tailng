import { Component } from '@angular/core';
import { TngMenubar } from '@tailng-ui/components';
import { TngMenubar as TngMenubarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-menubar-playground-page',
  imports: [TngMenubarPrimitive, TngMenubar],
  templateUrl: './menubar-playground-page.component.html',
  styleUrl: './menubar-playground-page.component.css',
})
export class MenubarPlaygroundPageComponent {}
