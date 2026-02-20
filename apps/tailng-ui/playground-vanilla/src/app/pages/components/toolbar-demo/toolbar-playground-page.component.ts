import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngToolbar } from '@tailng-ui/components';
import { TngToolbar as TngToolbarPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-toolbar-playground-page',
  imports: [RouterLink, TngToolbarPrimitive, TngToolbar],
  templateUrl: './toolbar-playground-page.component.html',
  styleUrl: './toolbar-playground-page.component.css',
})
export class ToolbarPlaygroundPageComponent {}
