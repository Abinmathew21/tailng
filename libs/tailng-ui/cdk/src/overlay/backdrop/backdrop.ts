import {
  type TngOverlayBackdropController,
  type TngOverlayBackdropControllerOptions,
  type TngOverlayBackdropDefinition,
  type TngOverlayBackdropDismissReason,
} from './backdrop.types';

type TngRegisteredBackdrop = Readonly<{
  definition: TngOverlayBackdropDefinition;
  order: number;
  portalId: string;
}>;

function compareBackdrops(left: TngRegisteredBackdrop, right: TngRegisteredBackdrop): number {
  const priorityDiff = (left.definition.priority ?? 0) - (right.definition.priority ?? 0);
  return priorityDiff === 0 ? left.order - right.order : priorityDiff;
}

function findBackdropIndex(backdrops: readonly TngRegisteredBackdrop[], backdropId: string): number {
  return backdrops.findIndex((entry) => entry.definition.backdropId === backdropId);
}

function createPortalId(backdropId: string): string {
  return `tng-overlay-backdrop:${backdropId}`;
}

class OverlayBackdropController implements TngOverlayBackdropController {
  private readonly backdrops: TngRegisteredBackdrop[] = [];
  private readonly portal: TngOverlayBackdropControllerOptions['portal'];
  private nextOrder = 0;

  public constructor(options: TngOverlayBackdropControllerOptions) {
    this.portal = options.portal;
  }

  public clear(): void {
    const backdropIds = this.getBackdropIds();
    for (const backdropId of backdropIds) {
      this.hide(backdropId);
    }
  }

  public dismissTop(reason: TngOverlayBackdropDismissReason): void {
    const topBackdrop = this.getTopBackdrop();
    if (topBackdrop === null) {
      return;
    }

    const onDismiss = topBackdrop.definition.onDismiss;
    if (onDismiss === undefined) {
      this.hide(topBackdrop.definition.backdropId);
      return;
    }

    onDismiss(reason);
  }

  public getBackdropIds(): readonly string[] {
    return this.backdrops.map((entry) => entry.definition.backdropId);
  }

  public getTopBackdropId(): string | null {
    const topBackdrop = this.getTopBackdrop();
    return topBackdrop === null ? null : topBackdrop.definition.backdropId;
  }

  public handlePointerDown(backdropId: string): boolean {
    const topBackdrop = this.getTopBackdrop();
    if (topBackdrop === null) {
      return false;
    }

    if (topBackdrop.definition.backdropId !== backdropId) {
      return false;
    }

    if (topBackdrop.definition.dismissOnPointerDown === false) {
      return false;
    }

    this.dismissTop('backdrop-pointer');
    return true;
  }

  public hide(backdropId: string): void {
    const index = findBackdropIndex(this.backdrops, backdropId);
    if (index < 0) {
      return;
    }

    const entry = this.backdrops[index];
    if (entry !== undefined) {
      this.portal.unmount(entry.portalId);
      this.backdrops.splice(index, 1);
    }
  }

  public isShown(backdropId: string): boolean {
    return findBackdropIndex(this.backdrops, backdropId) >= 0;
  }

  public show(definition: TngOverlayBackdropDefinition): boolean {
    this.hide(definition.backdropId);
    const portalId = createPortalId(definition.backdropId);
    const isMounted = this.portal.mount({
      node: definition.node,
      portalId,
      target: definition.target,
    });
    if (!isMounted) {
      return false;
    }

    this.nextOrder += 1;
    this.backdrops.push({ definition, order: this.nextOrder, portalId });
    this.backdrops.sort(compareBackdrops);
    return true;
  }

  private getTopBackdrop(): TngRegisteredBackdrop | null {
    const topBackdrop = this.backdrops[this.backdrops.length - 1];
    return topBackdrop ?? null;
  }
}

export function createOverlayBackdropController(
  options: TngOverlayBackdropControllerOptions,
): TngOverlayBackdropController {
  return new OverlayBackdropController(options);
}
