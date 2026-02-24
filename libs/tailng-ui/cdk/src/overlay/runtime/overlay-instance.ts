import { computeOverlayPosition } from '../positioning/positioning';
import type { TngOverlayLayer, TngOverlayDismissReason } from '../layer-stack/layer-stack.types';
import type { TngOverlayInstance, TngOverlayInstanceOptions } from './overlay-instance.types';

export function createOverlayInstance(options: TngOverlayInstanceOptions): TngOverlayInstance {
  let open = false;
  let destroyed = false;

  const dismissOnEscape = options.dismissOnEscape ?? true;
  const dismissOnOutsidePointer = options.dismissOnOutsidePointer ?? true;

  const layer: TngOverlayLayer = {
    id: options.id,
    modal: options.modal ?? false,
    priority: options.priority,
    dismissOnEscape,
    dismissOnOutsidePointer,
    containsTarget: options.floating.containsTarget,
    onDismiss: (reason: TngOverlayDismissReason) => {
      closeInternal(reason);
    },
  };

  function ensureAlive(): void {
    if (destroyed) throw new Error(`Overlay instance "${options.id}" is destroyed.`);
  }

  function updatePosition(): void {
    if (!open) return;

    const result = computeOverlayPosition({
      anchorRect: options.anchor.getRect(),
      overlayRect: options.floating.getRect(),
      viewportRect: options.getViewportRect(),
      placement: options.placement,
      offset: options.offset,
      collision: options.collision,
      direction: options.direction,
    });

    options.floating.applyPosition(result);
  }

  function openInternal(): void {
    if (open) return;
    open = true;

    options.runtime.registerLayer(layer);
    updatePosition();
    options.onOpenChange?.(true, 'programmatic');
  }

  function closeInternal(reason: TngOverlayDismissReason): void {
    if (!open) return;
    open = false;

    options.runtime.unregisterLayer(options.id);
    options.onOpenChange?.(false, reason);
  }

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    closeInternal('programmatic');
  }

  return Object.freeze({
    isOpen: () => open,
    open: () => {
      ensureAlive();
      openInternal();
    },
    close: (reason: TngOverlayDismissReason = 'programmatic') => {
      ensureAlive();
      closeInternal(reason);
    },
    toggle: () => {
      ensureAlive();
      if (open) closeInternal('programmatic');
      else openInternal();
    },
    updatePosition: () => {
      ensureAlive();
      updatePosition();
    },
    destroy,
  });
}