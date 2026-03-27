import { booleanAttribute, Component, input } from '@angular/core';
import { TngSkeleton as TngSkeletonPrimitive } from '@tailng-ui/primitives';

export function resolveTngSkeletonCssSize(value: string, fallback: string): string {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

@Component({
  selector: 'tng-skeleton',
  imports: [TngSkeletonPrimitive],
  templateUrl: './tng-skeleton.component.html',
  styleUrl: './tng-skeleton.component.css',
})
export class TngSkeletonComponent {
  public readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly height = input<string>('1rem');
  public readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly width = input<string>('100%');

  public resolveHeight(): string {
    return resolveTngSkeletonCssSize(this.height(), '1rem');
  }

  public resolveWidth(): string {
    return resolveTngSkeletonCssSize(this.width(), '100%');
  }
}
export { TngSkeletonComponent as TngSkeleton };
