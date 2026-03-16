import { createOverlayRuntime } from '@tailng-ui/cdk';
import type { TngOverlayInteractionDomDocument } from '@tailng-ui/cdk/overlay';

const primitiveOverlayDocument = typeof document === 'undefined' ? null : (document as TngOverlayInteractionDomDocument);

export const tngPrimitiveOverlayRuntime = createOverlayRuntime({
  documentRef: primitiveOverlayDocument,
});
