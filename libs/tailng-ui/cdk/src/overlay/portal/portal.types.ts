export type TngPortalNode = object;

export type TngPortalContainerElement = Readonly<{
  appendChild: (node: TngPortalNode) => void;
  removeChild: (node: TngPortalNode) => void;
}>;

export type TngPortalDocument = Readonly<{
  body: TngPortalContainerElement;
  getElementById: (id: string) => TngPortalContainerElement | null;
}>;

export type TngPortalTarget = Readonly<{
  elementId?: string;
}>;

export type TngPortalMountOptions = Readonly<{
  node: TngPortalNode;
  portalId: string;
  target?: TngPortalTarget;
}>;

export type TngPortalManagerOptions = Readonly<{
  documentRef?: TngPortalDocument | null;
  isBrowser?: boolean;
}>;

export type TngPortalManager = Readonly<{
  clear: () => void;
  getMountedPortalIds: () => readonly string[];
  isMounted: (portalId: string) => boolean;
  mount: (options: TngPortalMountOptions) => boolean;
  unmount: (portalId: string) => void;
}>;
