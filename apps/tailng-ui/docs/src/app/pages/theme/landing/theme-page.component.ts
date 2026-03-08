import { Component } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-theme-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
  ],
  templateUrl: './theme-page.component.html',
  styleUrl: './theme-page.component.css',
})
export class ThemePageComponent {}
