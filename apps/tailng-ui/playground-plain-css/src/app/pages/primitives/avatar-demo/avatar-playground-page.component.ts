import { Component, computed, signal } from '@angular/core';
import { TngAvatar } from '@tailng-ui/components';
import {
  TngAvatar as TngAvatarPrimitive,
  TngAvatarFallback as TngAvatarFallbackPrimitive,
  TngAvatarImage as TngAvatarImagePrimitive,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-avatar-playground-page',
  imports: [TngAvatarPrimitive, TngAvatarImagePrimitive, TngAvatarFallbackPrimitive, TngAvatar],
  templateUrl: './avatar-playground-page.component.html',
  styleUrl: './avatar-playground-page.component.css',
})
export class AvatarPlaygroundPageComponent {
  protected readonly sampleImage = `data:image/svg+xml,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='avatar-g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%2360a5fa'/><stop offset='100%' stop-color='%232563eb'/></linearGradient></defs><rect width='100' height='100' fill='url(%23avatar-g)'/><circle cx='50' cy='40' r='20' fill='%23cbd5e1'/><rect x='22' y='64' width='56' height='24' rx='12' fill='%23cbd5e1'/></svg>",
  )}`;
  protected readonly brokenImage = 'broken://avatar';

  public readonly componentSrc = signal<string>(this.sampleImage);
  public readonly headlessErrored = signal(false);
  public readonly headlessSrc = signal<string | null>(this.sampleImage);
  public readonly showHeadlessFallback = computed(
    () => this.headlessSrc() === null || this.headlessErrored(),
  );

  public onHeadlessError(): void {
    this.headlessErrored.set(true);
  }

  public onHeadlessLoad(): void {
    this.headlessErrored.set(false);
  }

  public useBrokenSources(): void {
    this.headlessErrored.set(false);
    this.headlessSrc.set(this.brokenImage);
    this.componentSrc.set(this.brokenImage);
  }

  public useValidSources(): void {
    this.headlessErrored.set(false);
    this.headlessSrc.set(this.sampleImage);
    this.componentSrc.set(this.sampleImage);
  }

  public useNoHeadlessSource(): void {
    this.headlessErrored.set(false);
    this.headlessSrc.set(null);
  }
}
