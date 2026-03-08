import { Component } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-primitives-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
  ],
  templateUrl: './primitives-page.component.html',
  styleUrl: './primitives-page.component.css',
})
export class PrimitivesPageComponent {}
