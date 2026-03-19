import { Component, input } from '@angular/core';
import {
  TngEmpty as TngEmptyPrimitive,
  TngEmptyActions as TngEmptyActionsPrimitive,
  TngEmptyDescription as TngEmptyDescriptionPrimitive,
  TngEmptyIcon as TngEmptyIconPrimitive,
  TngEmptyTitle as TngEmptyTitlePrimitive,
} from '@tailng-ui/primitives';

type TngEmptyAlign = 'center' | 'start';

@Component({
  standalone: true,
  selector: 'tng-empty',
  imports: [TngEmptyPrimitive],
  templateUrl: './tng-empty.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyComponent {
  public readonly align = input<TngEmptyAlign>('center');
}

@Component({
  standalone: true,
  selector: 'tng-empty-icon',
  imports: [TngEmptyIconPrimitive],
  templateUrl: './tng-empty-icon.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyIconComponent {}

@Component({
  standalone: true,
  selector: 'tng-empty-title',
  imports: [TngEmptyTitlePrimitive],
  templateUrl: './tng-empty-title.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyTitleComponent {}

@Component({
  standalone: true,
  selector: 'tng-empty-description',
  imports: [TngEmptyDescriptionPrimitive],
  templateUrl: './tng-empty-description.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyDescriptionComponent {}

@Component({
  standalone: true,
  selector: 'tng-empty-actions',
  imports: [TngEmptyActionsPrimitive],
  templateUrl: './tng-empty-actions.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyActionsComponent {}
