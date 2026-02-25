import { Component } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import {
  TngCard as TngCardPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardTitle as TngCardTitlePrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-card-playground-page',
  imports: [
    TngCardPrimitive,
    TngCardHeaderPrimitive,
    TngCardTitlePrimitive,
    TngCardDescriptionPrimitive,
    TngCardContentPrimitive,
    TngCardFooterPrimitive,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
  ],
  templateUrl: './card-playground-page.component.html',
  styleUrl: './card-playground-page.component.css',
})
export class CardPlaygroundPageComponent {}
