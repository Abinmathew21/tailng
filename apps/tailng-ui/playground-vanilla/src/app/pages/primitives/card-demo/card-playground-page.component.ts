import { Component } from '@angular/core';
import {
  TngCard,
  TngCardContent,
  TngCardDescription,
  TngCardFooter,
  TngCardHeader,
  TngCardTitle,
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
    TngCard,
    TngCardHeader,
    TngCardTitle,
    TngCardDescription,
    TngCardContent,
    TngCardFooter,
  ],
  templateUrl: './card-playground-page.component.html',
  styleUrl: './card-playground-page.component.css',
})
export class CardPlaygroundPageComponent {}
