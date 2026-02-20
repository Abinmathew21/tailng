import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TngAvatar } from '@tailng-ui/components';
import {
  TngAvatar as TngAvatarPrimitive,
  TngAvatarFallback as TngAvatarFallbackPrimitive,
  TngAvatarImage as TngAvatarImagePrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-avatar-playground-page',
  imports: [RouterLink, TngAvatarPrimitive, TngAvatarImagePrimitive, TngAvatarFallbackPrimitive, TngAvatar],
  templateUrl: './avatar-playground-page.component.html',
  styleUrl: './avatar-playground-page.component.css',
})
export class AvatarPlaygroundPageComponent {
  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='#22d3ee'/><stop offset='100%' stop-color='#3b82f6'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/><circle cx='50' cy='40' r='20' fill='#e2e8f0'/><rect x='22' y='64' width='56' height='24' rx='12' fill='#e2e8f0'/></svg>",
  )}`;
}
