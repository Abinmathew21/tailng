import { Component } from '@angular/core';
import {
  TngCard as TngCardPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardTitle as TngCardTitlePrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'tng-card',
  imports: [TngCardPrimitive],
  templateUrl: './tng-card.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCard {
}

@Component({
  selector: 'tng-card-header',
  imports: [TngCardHeaderPrimitive],
  templateUrl: './tng-card-header.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardHeader {
}

@Component({
  selector: 'tng-card-title',
  imports: [TngCardTitlePrimitive],
  templateUrl: './tng-card-title.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardTitle {
}

@Component({
  selector: 'tng-card-description',
  imports: [TngCardDescriptionPrimitive],
  templateUrl: './tng-card-description.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardDescription {
}

@Component({
  selector: 'tng-card-content',
  imports: [TngCardContentPrimitive],
  templateUrl: './tng-card-content.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardContent {
}

@Component({
  selector: 'tng-card-footer',
  imports: [TngCardFooterPrimitive],
  templateUrl: './tng-card-footer.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardFooter {
}
