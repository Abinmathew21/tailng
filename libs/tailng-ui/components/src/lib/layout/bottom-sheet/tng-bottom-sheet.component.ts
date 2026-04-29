import { Component, input } from '@angular/core';

@Component({
  selector: 'tng-bottom-sheet',
  templateUrl: './tng-bottom-sheet.component.html',
  styleUrl: './tng-bottom-sheet.component.css',
})
export class TngBottomSheetComponent {
  public readonly ariaLabel = input<string>('Bottom Sheet');
}
