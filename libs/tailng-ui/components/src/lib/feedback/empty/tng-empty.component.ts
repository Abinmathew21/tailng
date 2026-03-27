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
  selector: 'tng-empty',
  imports: [TngEmptyPrimitive],
  templateUrl: './tng-empty.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyComponent {
  public readonly align = input<TngEmptyAlign>('center');
}

@Component({
  selector: 'tng-empty-icon',
  imports: [TngEmptyIconPrimitive],
  templateUrl: './tng-empty-icon.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyIconComponent {}

@Component({
  selector: 'tng-empty-title',
  imports: [TngEmptyTitlePrimitive],
  templateUrl: './tng-empty-title.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyTitleComponent {}

@Component({
  selector: 'tng-empty-description',
  imports: [TngEmptyDescriptionPrimitive],
  templateUrl: './tng-empty-description.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyDescriptionComponent {}

@Component({
  selector: 'tng-empty-actions',
  imports: [TngEmptyActionsPrimitive],
  templateUrl: './tng-empty-actions.component.html',
  styleUrl: './tng-empty.component.css',
})
export class TngEmptyActionsComponent {}
export { TngEmptyComponent as TngEmpty };
export { TngEmptyIconComponent as TngEmptyIcon };
export { TngEmptyTitleComponent as TngEmptyTitle };
export { TngEmptyDescriptionComponent as TngEmptyDescription };
export { TngEmptyActionsComponent as TngEmptyActions };
