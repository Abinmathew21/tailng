import type { ComboboxListboxApi } from '../../../internal/combobox';

/**
 * Abstract host API for select-like controls (single and multi).
 * Shared overlay/parts depend on this, not concrete TngSelect or TngMultiSelect.
 */
export interface TngSelectHostApi {
  readonly hostElement: HTMLElement;
  readonly open: () => boolean;
  readonly disabled: () => boolean;
  readonly loading: () => boolean;
  readonly invalid: () => boolean;
  readonly labelId: () => string | null;
  readonly descriptionId: () => string | null;
  readonly errorId: () => string | null;
  readonly multiple: () => boolean;

  openSelect(): void;
  close(): void;
  toggle(): void;

  setContentId(id: string | null): void;
  getContentId(): string | null;
  setListboxId(id: string | null): void;
  getListboxId(): string | null;
  setActiveDescendantId(id: string | null): void;
  getActiveDescendantId(): string | null;

  setListboxApi(api: ComboboxListboxApi | null): void;
  getListboxApi(): ComboboxListboxApi | null;
}
