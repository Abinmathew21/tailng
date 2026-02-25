import { Component } from '@angular/core';
import { TngBottomSheetComponent } from '@tailng-ui/components';
import { TngBottomSheet as TngBottomSheetPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-bottom-sheet-playground-page',
  imports: [TngBottomSheetPrimitive, TngBottomSheetComponent],
  templateUrl: './bottom-sheet-playground-page.component.html',
  styleUrl: './bottom-sheet-playground-page.component.css',
})
export class BottomSheetPlaygroundPageComponent {}
