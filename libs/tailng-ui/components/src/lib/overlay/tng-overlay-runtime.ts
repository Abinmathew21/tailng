import { createOverlayRuntime } from '@tailng-ui/cdk';

function resolveGlobalDocument(): Document | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document;
}

export const tngOverlayRuntime = createOverlayRuntime({
  documentRef: resolveGlobalDocument(),
});
