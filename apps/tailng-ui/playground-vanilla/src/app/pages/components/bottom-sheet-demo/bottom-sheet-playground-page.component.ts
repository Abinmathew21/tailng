import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngBottomSheet } from '@tailng-ui/components';
import { TngBottomSheet as TngBottomSheetPrimitive } from '@tailng-ui/primitives';

@Component({
  selector: 'app-bottom-sheet-playground-page',
  imports: [RouterLink, TngBottomSheetPrimitive, TngBottomSheet],
  templateUrl: './bottom-sheet-playground-page.component.html',
  styleUrl: './bottom-sheet-playground-page.component.css',
})
export class BottomSheetPlaygroundPageComponent {}
