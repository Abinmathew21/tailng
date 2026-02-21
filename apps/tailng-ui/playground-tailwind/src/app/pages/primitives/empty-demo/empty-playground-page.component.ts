import { Component } from '@angular/core';
import {
  TngEmpty,
  TngEmptyActions,
  TngEmptyDescription,
  TngEmptyIcon,
  TngEmptyTitle,
} from '@tailng-ui/components';
import {
  TngEmpty as TngEmptyPrimitive,
  TngEmptyActions as TngEmptyActionsPrimitive,
  TngEmptyDescription as TngEmptyDescriptionPrimitive,
  TngEmptyIcon as TngEmptyIconPrimitive,
  TngEmptyTitle as TngEmptyTitlePrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-empty-playground-page',
  imports: [
    TngEmptyPrimitive,
    TngEmptyIconPrimitive,
    TngEmptyTitlePrimitive,
    TngEmptyDescriptionPrimitive,
    TngEmptyActionsPrimitive,
    TngEmpty,
    TngEmptyIcon,
    TngEmptyTitle,
    TngEmptyDescription,
    TngEmptyActions,
  ],
  templateUrl: './empty-playground-page.component.html',
  styleUrl: './empty-playground-page.component.css',
})
export class EmptyPlaygroundPageComponent {}
