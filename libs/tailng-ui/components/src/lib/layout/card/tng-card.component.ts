import { booleanAttribute, Component, input } from '@angular/core';
import {
  TngCard as TngCardPrimitive,
  TngCardActions as TngCardActionsPrimitive,
  TngCardContent as TngCardContentPrimitive,
  TngCardDescription as TngCardDescriptionPrimitive,
  TngCardDivider as TngCardDividerPrimitive,
  TngCardFooter as TngCardFooterPrimitive,
  TngCardHeader as TngCardHeaderPrimitive,
  TngCardLink as TngCardLinkPrimitive,
  TngCardMedia as TngCardMediaPrimitive,
  TngCardTitle as TngCardTitlePrimitive,
} from '@tailng-ui/primitives';

const cardVariants = ['ghost', 'outline', 'solid'] as const;
const cardTones = ['danger', 'info', 'neutral', 'primary', 'success', 'warning'] as const;
const cardPaddings = ['lg', 'md', 'none', 'sm'] as const;
const cardActionAlignments = ['end', 'start'] as const;

const cardVariantSet = new Set<TngCardVariant>(cardVariants);
const cardToneSet = new Set<TngCardTone>(cardTones);
const cardPaddingSet = new Set<TngCardPadding>(cardPaddings);
const cardActionAlignmentSet = new Set<TngCardActionsAlign>(cardActionAlignments);

const defaultCardVariant: TngCardVariant = 'solid';
const defaultCardTone: TngCardTone = 'neutral';
const defaultCardPadding: TngCardPadding = 'md';
const defaultCardActionsAlign: TngCardActionsAlign = 'end';

export type TngCardVariant = (typeof cardVariants)[number];
export type TngCardTone = (typeof cardTones)[number];
export type TngCardPadding = (typeof cardPaddings)[number];
export type TngCardActionsAlign = (typeof cardActionAlignments)[number];

function coerceCardVariant(value: string): TngCardVariant {
  if (cardVariantSet.has(value as TngCardVariant)) {
    return value as TngCardVariant;
  }

  return defaultCardVariant;
}

function coerceCardTone(value: string): TngCardTone {
  if (cardToneSet.has(value as TngCardTone)) {
    return value as TngCardTone;
  }

  return defaultCardTone;
}

function coerceCardPadding(value: string): TngCardPadding {
  if (cardPaddingSet.has(value as TngCardPadding)) {
    return value as TngCardPadding;
  }

  return defaultCardPadding;
}

function coerceCardActionsAlign(value: string): TngCardActionsAlign {
  if (cardActionAlignmentSet.has(value as TngCardActionsAlign)) {
    return value as TngCardActionsAlign;
  }

  return defaultCardActionsAlign;
}

@Component({
  standalone: true,
  selector: 'tng-card',
  imports: [TngCardPrimitive],
  templateUrl: './tng-card.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardComponent {
  public readonly elevated = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly interactive = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly padding = input<TngCardPadding, string>(defaultCardPadding, {
    transform: coerceCardPadding,
  });
  public readonly tone = input<TngCardTone, string>(defaultCardTone, {
    transform: coerceCardTone,
  });
  public readonly variant = input<TngCardVariant, string>(defaultCardVariant, {
    transform: coerceCardVariant,
  });
}

@Component({
  standalone: true,
  selector: 'tng-card-header',
  imports: [TngCardHeaderPrimitive],
  templateUrl: './tng-card-header.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardHeaderComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-title',
  imports: [TngCardTitlePrimitive],
  templateUrl: './tng-card-title.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardTitleComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-description',
  imports: [TngCardDescriptionPrimitive],
  templateUrl: './tng-card-description.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardDescriptionComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-content',
  imports: [TngCardContentPrimitive],
  templateUrl: './tng-card-content.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardContentComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-footer',
  imports: [TngCardFooterPrimitive],
  templateUrl: './tng-card-footer.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardFooterComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-media',
  imports: [TngCardMediaPrimitive],
  templateUrl: './tng-card-media.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardMediaComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-actions',
  imports: [TngCardActionsPrimitive],
  templateUrl: './tng-card-actions.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardActionsComponent {
  public readonly align = input<TngCardActionsAlign, string>(defaultCardActionsAlign, {
    transform: coerceCardActionsAlign,
  });
}

@Component({
  standalone: true,
  selector: 'tng-card-divider',
  imports: [TngCardDividerPrimitive],
  templateUrl: './tng-card-divider.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardDividerComponent {
}

@Component({
  standalone: true,
  selector: 'tng-card-link',
  imports: [TngCardLinkPrimitive],
  templateUrl: './tng-card-link.component.html',
  styleUrl: './tng-card.component.css',
})
export class TngCardLinkComponent {
  public readonly ariaLabel = input<string | null>(null);
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly href = input<string | null>('#');
  public readonly rel = input<string | null>(null);
  public readonly target = input<string | null>(null);

  protected onClick(...args: readonly unknown[]): void {
    if (!this.disabled()) {
      return;
    }

    const [event] = args;
    if (!(event instanceof Event)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
