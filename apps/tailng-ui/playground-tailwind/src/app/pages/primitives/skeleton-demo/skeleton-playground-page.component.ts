import { Component, signal } from '@angular/core';
import { TngSkeleton as TngSkeletonComponent } from '@tailng-ui/components';
import { TngSkeleton } from '@tailng-ui/primitives';

@Component({
  selector: 'app-skeleton-playground-page',
  imports: [TngSkeleton, TngSkeletonComponent],
  templateUrl: './skeleton-playground-page.component.html',
  styleUrl: './skeleton-playground-page.component.css',
})
export class SkeletonPlaygroundPageComponent {
  public readonly animated = signal(true);
  public readonly rounded = signal(true);

  public onToggleAnimated(): void {
    this.animated.set(!this.animated());
  }

  public onToggleRounded(): void {
    this.rounded.set(!this.rounded());
  }
}
