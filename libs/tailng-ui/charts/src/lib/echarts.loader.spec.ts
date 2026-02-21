import { describe, expect, it } from 'vitest';
import { loadTngEchartsRuntime, resolveTngEchartsModule } from './echarts.loader';

describe('resolveTngEchartsModule', () => {
  it('accepts runtime objects with init method', () => {
    const runtime = {
      init: (): null => null,
    };

    expect(resolveTngEchartsModule(runtime)).toEqual(runtime);
  });

  it('accepts runtime objects from default export', () => {
    const runtime = {
      init: (): null => null,
    };

    expect(resolveTngEchartsModule({ default: runtime })).toEqual(runtime);
  });

  it('rejects invalid runtime objects', () => {
    expect(resolveTngEchartsModule({})).toBeNull();
    expect(resolveTngEchartsModule(null)).toBeNull();
  });
});

describe('loadTngEchartsRuntime', () => {
  it('loads runtime from custom loader', async () => {
    const runtime = {
      init: (): null => null,
    };

    await expect(loadTngEchartsRuntime(async () => runtime)).resolves.toEqual(runtime);
  });

  it('throws when custom loader returns invalid runtime', async () => {
    await expect(loadTngEchartsRuntime(async () => ({ nope: true }))).rejects.toThrow(
      'invalid module',
    );
  });
});
