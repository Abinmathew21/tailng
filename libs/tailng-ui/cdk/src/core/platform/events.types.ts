export type TngMouseEvent = Readonly<{
  defaultPrevented?: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  // add only if you actually use them:
  // button?: number;
  // target?: unknown;
}>;

export type TngKeyboardEvent = Readonly<{
  key: string;
  defaultPrevented?: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}>;