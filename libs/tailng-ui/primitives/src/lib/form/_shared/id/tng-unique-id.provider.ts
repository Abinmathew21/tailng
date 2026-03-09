import { Provider } from '@angular/core';
import {
  TNG_UNIQUE_ID_GENERATOR,
  type TngUniqueIdGenerator,
} from './tng-unique-id.token';

/**
 * Overrides the unique id generator used by TngUniqueIdService.
 *
 * Useful for:
 * - tests (deterministic ids)
 * - future SSR/hydration strategies
 */
export function provideTngUniqueId(generator: TngUniqueIdGenerator): Provider {
  return {
    provide: TNG_UNIQUE_ID_GENERATOR,
    useValue: generator,
  };
}