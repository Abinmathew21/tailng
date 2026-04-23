import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ALL_PLAYGROUND_ITEMS } from '@tailng-ui/registry';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly items = ALL_PLAYGROUND_ITEMS.filter((item) => item.tailwind);
}
