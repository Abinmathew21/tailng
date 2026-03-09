import { Injectable, inject } from '@angular/core';
import { TNG_UNIQUE_ID_GENERATOR, type TngUniqueIdGenerator } from './tng-unique-id.token';

@Injectable({ providedIn: 'root' })
export class TngUniqueIdService {
  private readonly generate: TngUniqueIdGenerator = inject(TNG_UNIQUE_ID_GENERATOR);

  /**
   * Generates a unique id using the provided prefix.
   * Example: nextId('tng-input') -> 'tng-input-1'
   */
  public nextId(prefix: string): string {
    return this.generate(prefix);
  }
}