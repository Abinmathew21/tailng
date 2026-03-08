import { Component } from '@angular/core';
import {
  TngCardActionsComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardDividerComponent,
  TngCardFooterComponent,
  TngCardHeaderComponent,
  TngCardLinkComponent,
  TngCardMediaComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import {
  TngCardActions as TngCardActionsPrimitive,
  TngCard as TngCardPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardDivider as TngCardDividerPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardLink as TngCardLinkPrimitive,
  TngCardMedia as TngCardMediaPrimitive,
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
    TngCardMediaPrimitive,
    TngCardActionsPrimitive,
    TngCardDividerPrimitive,
    TngCardLinkPrimitive,
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCardFooterComponent,
    TngCardMediaComponent,
    TngCardActionsComponent,
    TngCardDividerComponent,
    TngCardLinkComponent,
  ],
  templateUrl: './card-playground-page.component.html',
})
export class CardPlaygroundPageComponent {}
