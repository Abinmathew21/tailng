import { Component } from '@angular/core';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';

@Component({
  selector: 'app-icons-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
  ],
  templateUrl: './icons-page.component.html',
  styleUrl: './icons-page.component.css',
})
export class IconsPageComponent {}
