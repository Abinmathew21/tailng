import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngSelect } from '@tailng-ui/components';
import { TngSelect as TngSelectPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-select-playground-page',
  imports: [RouterLink, TngSelectPrimitive, TngSelect],
  templateUrl: './select-playground-page.component.html',
  styleUrl: './select-playground-page.component.css',
})
export class SelectPlaygroundPageComponent {}
