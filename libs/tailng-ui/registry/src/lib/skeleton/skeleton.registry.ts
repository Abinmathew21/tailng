import type { RegistryItem } from '../registry.types';

const skeletonPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSkeletonDataAnimated(animated: boolean): 'false' | 'true' {
  return animated ? 'true' : 'false';
}

export function resolveTngSkeletonDataRounded(rounded: boolean): 'false' | 'true' {
  return rounded ? 'true' : 'false';
}

@Directive({
  selector: '[tngSkeleton]',
  exportAs: 'tngSkeleton',
})
export class TngSkeletonPrimitive {
  readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHiddenAttr = 'true' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'presentation' as const;

  @HostBinding('attr.data-animated')
  protected get dataAnimatedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataAnimated(this.animated());
  }

  @HostBinding('attr.data-rounded')
  protected get dataRoundedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataRounded(this.rounded());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'skeleton' as const;
}
`;

const skeletonComponentTsTemplate = `import { booleanAttribute, Component, input } from '@angular/core';
import { TngSkeletonPrimitive } from './tng-skeleton-primitive';

export function resolveTngSkeletonCssSize(value: string, fallback: string): string {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

@Component({
  selector: 'tng-skeleton',
  imports: [TngSkeletonPrimitive],
  templateUrl: './tng-skeleton.html',
  styleUrl: './tng-skeleton.css',
})
export class TngSkeleton {
  readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly height = input<string>('1rem');
  readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly width = input<string>('100%');

  resolveHeight(): string {
    return resolveTngSkeletonCssSize(this.height(), '1rem');
  }

  resolveWidth(): string {
    return resolveTngSkeletonCssSize(this.width(), '100%');
  }
}
`;

const skeletonTemplateHtml = `<div
  tngSkeleton
  class="tng-skeleton"
  [animated]="animated()"
  [rounded]="rounded()"
  [style.width]="resolveWidth()"
  [style.height]="resolveHeight()"
></div>
`;

const skeletonTemplateCss = `:host {
  display: block;
}

.tng-skeleton {
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
  background-size: 220% 100%;
}

.tng-skeleton[data-rounded='true'] {
  border-radius: 0.6rem;
}

.tng-skeleton[data-rounded='false'] {
  border-radius: 0;
}

.tng-skeleton[data-animated='true'] {
  animation: tng-skeleton-shimmer 1.3s linear infinite;
}

@keyframes tng-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -20% 0;
  }
}
`;

const skeletonIndexTsTemplate = `export * from './tng-skeleton';
export * from './tng-skeleton-primitive';
`;

export const skeletonRegistryItem: RegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for skeleton primitive and wrapper.',
  files: [
    {
      content: skeletonPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton-primitive.ts',
    },
    {
      content: skeletonComponentTsTemplate,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.ts',
    },
    {
      content: skeletonTemplateHtml,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.html',
    },
    {
      content: skeletonTemplateCss,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.css',
    },
    {
      content: skeletonIndexTsTemplate,
      path: 'src/app/tailng-ui/skeleton/index.ts',
    },
  ],
  name: 'skeleton',
};
