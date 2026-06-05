/**
 * Public type contracts for the `tngFileUpload` primitive directive.
 *
 * These types describe the data emitted by the directive's outputs and the
 * drag state it reflects on the host element. They are intentionally framework
 * agnostic so consumers can react to selection/rejection without depending on
 * any internal helper types.
 */

/**
 * Drag interaction state reflected on the host while a drag/drop gesture is in
 * progress.
 *
 * - `idle`: nothing is being dragged over the host.
 * - `dragging`: a drag gesture is currently over the host.
 * - `rejected`: reserved for implementations that surface a rejected drag state.
 */
export type TngFileUploadDragState = 'idle' | 'dragging' | 'rejected';

/**
 * Origin of a selection/rejection event. Currently only `drop` is emitted by
 * the headless directive, but `input` is reserved for a future click-to-upload
 * file picker so the event shape stays stable.
 */
export type TngFileUploadSource = 'drop' | 'input';

/**
 * Reason a file was rejected during validation.
 *
 * - `disabled`: the directive was disabled when the gesture happened.
 * - `multiple`: extra files were dropped while `multiple` is false.
 * - `type`: the file did not match the `accept` rules.
 * - `size`: the file exceeded `maxSize`.
 * - `empty`: reserved for empty/invalid file entries.
 */
export type TngFileUploadRejectReason = 'disabled' | 'multiple' | 'type' | 'size' | 'empty';

/**
 * A single rejected file paired with the reason it failed validation and a
 * human-readable message describing the failure.
 */
export type TngFileUploadRejectedFile = {
  readonly file: File;
  readonly reason: TngFileUploadRejectReason;
  readonly message: string;
};

/**
 * Payload emitted by `filesSelected` when one or more valid files are chosen.
 */
export type TngFileUploadSelectedEvent = {
  readonly files: readonly File[];
  readonly source: TngFileUploadSource;
};

/**
 * Payload emitted by `filesRejected` when one or more files fail validation.
 * The accepted files from the same gesture are included for convenience so
 * consumers can correlate the two outputs from a single drop.
 */
export type TngFileUploadRejectedEvent = {
  readonly rejected: readonly TngFileUploadRejectedFile[];
  readonly accepted: readonly File[];
  readonly source: TngFileUploadSource;
};
