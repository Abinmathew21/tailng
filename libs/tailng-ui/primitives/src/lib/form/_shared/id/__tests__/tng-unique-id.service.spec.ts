import { TestBed } from '@angular/core/testing';
import { TngUniqueIdService } from '../tng-unique-id.service';
import { provideTngUniqueId } from '../tng-unique-id.provider';

describe('TngUniqueIdService', () => {
  it('generates monotonic ids with the default generator', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(TngUniqueIdService);

    const id1 = service.nextId('tng-input');
    const id2 = service.nextId('tng-input');

    expect(id1).toBe('tng-input-1');
    expect(id2).toBe('tng-input-2');
  });

  it('supports overriding the generator via provideTngUniqueId()', () => {
    let n = 100;
    TestBed.configureTestingModule({
      providers: [
        provideTngUniqueId((prefix) => {
          n += 1;
          return `${prefix}-X${n}`;
        }),
      ],
    });

    const service = TestBed.inject(TngUniqueIdService);

    expect(service.nextId('tng-input')).toBe('tng-input-X101');
    expect(service.nextId('tng-input')).toBe('tng-input-X102');
    expect(service.nextId('tng-other')).toBe('tng-other-X103');
  });

  it('can be made deterministic in tests', () => {
    // Deterministic generator: prefix-based counter stored per test instance.
    const counters = new Map<string, number>();

    TestBed.configureTestingModule({
      providers: [
        provideTngUniqueId((prefix) => {
          const next = (counters.get(prefix) ?? 0) + 1;
          counters.set(prefix, next);
          return `${prefix}-${next}`;
        }),
      ],
    });

    const service = TestBed.inject(TngUniqueIdService);

    expect(service.nextId('a')).toBe('a-1');
    expect(service.nextId('a')).toBe('a-2');
    expect(service.nextId('b')).toBe('b-1');
  });
});