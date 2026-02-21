import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngInput } from '@tailng-ui/components';
import { TngInput as TngInputPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-input-playground-page',
  imports: [RouterLink, TngInputPrimitive, TngInput],
  templateUrl: './input-playground-page.component.html',
  styleUrl: './input-playground-page.component.css',
})
export class InputPlaygroundPageComponent {}
