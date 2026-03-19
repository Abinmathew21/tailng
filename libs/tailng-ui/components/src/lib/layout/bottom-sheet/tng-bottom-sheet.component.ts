import { Component, input } from '@angular/core';
import { TngBottomSheet as TngBottomSheetPrimitive } from '@tailng-ui/primitives';

@Component({
  standalone: true,
  selector: 'tng-bottom-sheet',
  imports: [TngBottomSheetPrimitive],
  templateUrl: './tng-bottom-sheet.component.html',
  styleUrl: './tng-bottom-sheet.component.css',
})
export class TngBottomSheetComponent {
  public readonly ariaLabel = input<string>('Bottom Sheet');
}
