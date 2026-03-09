import { InjectionToken } from '@angular/core';

/**
 * Generator function used by TngUniqueIdService.
 * Override this in tests (or future SSR strategies) using provideTngUniqueId().
 */
export type TngUniqueIdGenerator = (prefix: string) => string;

export const TNG_UNIQUE_ID_GENERATOR = new InjectionToken<TngUniqueIdGenerator>(
  'TNG_UNIQUE_ID_GENERATOR',
  {
    factory: () => {
      // Default generator: monotonic per-app runtime.
      // (Service wraps this with stable state.)
      let next = 0;
      return (prefix: string) => {
        next += 1;
        return `${prefix}-${next}`;
      };
    },
  },
);