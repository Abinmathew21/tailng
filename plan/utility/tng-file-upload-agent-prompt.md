# Agent Prompt: Create `tngFileUpload` Directive With Full Test Coverage

## Goal

Create a new headless `tngFileUpload` directive for TailNG UI that can be attached to any section-like element such as `div`, `section`, `label`, etc., to make it support drag-and-drop file selection and callback outputs.

The directive should be implemented as a **primitive**, not as a styled component.

## Target Location

Create the directive under:

```txt
libs/tailng-ui/primitives/src/lib/file-upload/
```

Suggested file structure:

```txt
libs/tailng-ui/primitives/src/lib/file-upload/
  index.ts
  tng-file-upload.directive.ts
  tng-file-upload.types.ts
```

Update the primitives public API export if required.

## Layering Decision

Use this architecture:

```txt
cdk        → optional reusable file utilities only
primitives → tngFileUpload directive
components → optional styled <tng-file-upload> component later
```

For this task, implement only the primitive directive.

Do not create a styled component yet.

## Directive Name

Directive selector:

```ts
[tngFileUpload]
```

Class name:

```ts
TngFileUploadDirective
```

The directive must be standalone.

## Intended Usage

Example usage:

```html
<div
  tngFileUpload
  [accept]="'.png,.jpg,.jpeg,.pdf'"
  [multiple]="true"
  [maxSize]="5 * 1024 * 1024"
  [disabled]="false"
  (filesSelected)="onFilesSelected($event)"
  (filesRejected)="onFilesRejected($event)"
  (dragStateChange)="onDragStateChange($event)"
>
  Drop files here
</div>
```

## Inputs

Implement the following signal-based inputs where possible, matching current TailNG / Angular conventions:

```ts
accept
multiple
maxSize
disabled
```

Suggested input behavior:

```ts
accept: string | string[] | null | undefined
multiple: boolean | string | null | undefined
maxSize: number | null | undefined
disabled: boolean | string | null | undefined
```

Use Angular `input()` and transform helpers where appropriate.

Boolean-like inputs should support normal Angular attribute usage:

```html
<div tngFileUpload multiple></div>
<div tngFileUpload disabled></div>
```

## Outputs

Implement outputs:

```ts
filesSelected
filesRejected
dragStateChange
```

Suggested event types:

```ts
export type TngFileUploadDragState = 'idle' | 'dragging' | 'rejected';

export type TngFileUploadRejectReason =
  | 'disabled'
  | 'multiple'
  | 'type'
  | 'size'
  | 'empty';

export interface TngFileUploadRejectedFile {
  file: File;
  reason: TngFileUploadRejectReason;
  message: string;
}

export interface TngFileUploadSelectedEvent {
  files: File[];
  source: 'drop' | 'input';
}

export interface TngFileUploadRejectedEvent {
  rejected: TngFileUploadRejectedFile[];
  accepted: File[];
  source: 'drop' | 'input';
}
```

If the existing TailNG style prefers simpler output shapes, it is acceptable to emit `File[]` for selected files and `TngFileUploadRejectedFile[]` for rejected files, but keep the API clean and documented.

## Required Behavior

The directive must:

- Make the host element act as a drop zone.
- Listen for `dragenter`, `dragover`, `dragleave`, and `drop`.
- Prevent browser default behavior for drag/drop events when the directive is enabled.
- Ignore drag/drop events when disabled.
- Emit selected/accepted files when valid files are dropped.
- Emit rejected files when files fail validation.
- Support file type validation using the `accept` input.
- Support max file size validation using the `maxSize` input.
- Support single-file mode when `multiple` is false.
- Support multiple-file mode when `multiple` is true.
- Expose drag state using host attributes/classes and `dragStateChange`.
- Reset drag state to `idle` after drop or drag leave.
- Avoid memory leaks.
- Avoid direct DOM manipulation where Angular host bindings/listeners are enough.
- Follow strict TypeScript typing.
- Avoid `any`.
- Avoid unused variables.
- Keep the directive headless and unstyled.

## Host Attributes / State Reflection

Reflect state on the host using data attributes.

Suggested attributes:

```html
data-file-upload
data-dragging
data-disabled
data-rejected
```

Expected behavior:

- `data-file-upload` should always exist on the host.
- `data-dragging` should exist only while dragging valid/active files over the host.
- `data-disabled` should exist when disabled.
- `data-rejected` may exist briefly or while the current drag/drop state is rejected.

Use TailNG naming conventions if there is an existing pattern in nearby primitive directives.

## File Type Validation

The `accept` input should support common browser-style accept values:

```txt
.pdf
.png,.jpg,.jpeg
image/*
application/pdf
image/png,application/pdf
```

Validation should support:

- File extension matching, e.g. `.pdf`
- Exact MIME type matching, e.g. `application/pdf`
- Wildcard MIME group matching, e.g. `image/*`

Be careful because some files may have an empty MIME type. In that case, extension matching should still work when possible.

## Max Size Validation

`maxSize` is in bytes.

Example:

```ts
5 * 1024 * 1024
```

If `maxSize` is null, undefined, zero, or less than zero, do not apply size validation unless the project prefers strict positive-only behavior.

## Multiple Validation

If `multiple` is false and more than one file is dropped:

Preferred behavior:

- Accept only the first valid file.
- Reject the remaining files with reason `multiple`.

Alternative acceptable behavior:

- Reject all files with reason `multiple`.

Choose one behavior and cover it clearly in tests.

Recommended behavior: accept the first valid file and reject the remaining files.

## Disabled Behavior

When disabled:

- Do not emit `filesSelected`.
- Do not emit `filesRejected`, unless the project prefers explicit disabled rejection.
- Do not prevent default browser behavior if the existing project convention is to make disabled directives passive.
- Reflect disabled state using `data-disabled`.

Recommended behavior: disabled should be passive and emit nothing.

## Accessibility

Since this is a headless drag/drop directive, do not force a role by default.

However:

- Do not remove existing ARIA attributes from the host.
- Do not overwrite user-provided `tabindex`, `role`, or labels.
- If click-to-upload support is added later, then keyboard support and accessible labeling should be handled carefully.

For this first version, drag/drop behavior is enough.

## Out of Scope

Do not implement:

- Styled `<tng-file-upload>` component.
- Preview UI.
- Progress bar.
- Actual upload to backend.
- HTTP upload service.
- Image compression.
- File picker button.
- Chunked upload.
- Directory upload.
- Paste-from-clipboard support.

## Implementation Notes

Prefer simple, testable helper functions for:

```ts
normalizeAccept(...)
matchesAccept(...)
normalizeFileList(...)
validateFiles(...)
```

These helpers can live in the same primitive folder initially.

If the same helpers are useful elsewhere later, they can be moved to `libs/tailng-ui/cdk`.

## Example Public API

```ts
export * from './tng-file-upload.directive';
export * from './tng-file-upload.types';
```

## Test Requirements

Use the existing TailNG test setup and style for primitives.

Tests should be exhaustive but practical. Use host test components where needed.

All test cases should be implemented as focused one-line specs grouped by feature/functionality.

## Test Cases

### Directive Creation / Basic Setup

- [ ] should create the directive when applied to a host element
- [ ] should expose the directive as a standalone directive
- [ ] should add the base `data-file-upload` attribute to the host
- [ ] should not require a specific host element type
- [ ] should work on a `div` host element
- [ ] should work on a `section` host element
- [ ] should preserve existing host classes
- [ ] should preserve existing host attributes

### Input Defaults

- [ ] should default `accept` to no type restriction
- [ ] should default `multiple` to false
- [ ] should default `maxSize` to no size restriction
- [ ] should default `disabled` to false
- [ ] should treat undefined `accept` as no restriction
- [ ] should treat null `accept` as no restriction
- [ ] should treat undefined `maxSize` as no restriction
- [ ] should treat null `maxSize` as no restriction

### Boolean Input Handling

- [ ] should treat `[multiple]="true"` as multiple enabled
- [ ] should treat `[multiple]="false"` as multiple disabled
- [ ] should treat plain `multiple` attribute as multiple enabled
- [ ] should treat `[disabled]="true"` as disabled
- [ ] should treat `[disabled]="false"` as enabled
- [ ] should treat plain `disabled` attribute as disabled

### Drag State

- [ ] should emit `dragStateChange` with `dragging` on drag enter
- [ ] should emit `dragStateChange` with `dragging` on drag over
- [ ] should emit `dragStateChange` with `idle` on drag leave
- [ ] should emit `dragStateChange` with `idle` after drop
- [ ] should not repeatedly emit the same drag state unnecessarily if state has not changed
- [ ] should add `data-dragging` while a file is dragged over the host
- [ ] should remove `data-dragging` when dragging leaves the host
- [ ] should remove `data-dragging` after files are dropped

### Drag Event Behavior

- [ ] should prevent default on drag enter when enabled
- [ ] should prevent default on drag over when enabled
- [ ] should prevent default on drop when enabled
- [ ] should stop propagation only if project convention requires it
- [ ] should not throw when drag event has no dataTransfer
- [ ] should not throw when dataTransfer has no files
- [ ] should reset drag state when drop event has no files

### Disabled State

- [ ] should reflect disabled state using `data-disabled`
- [ ] should remove `data-disabled` when enabled again
- [ ] should ignore drag enter when disabled
- [ ] should ignore drag over when disabled
- [ ] should ignore drag leave when disabled
- [ ] should ignore drop when disabled
- [ ] should not emit `filesSelected` when disabled
- [ ] should not emit `filesRejected` when disabled
- [ ] should not emit `dragStateChange` when disabled
- [ ] should not add `data-dragging` when disabled

### File Selection / Drop

- [ ] should emit `filesSelected` when a valid file is dropped
- [ ] should emit selected files in the same order as dropped
- [ ] should emit one file when multiple is false and one valid file is dropped
- [ ] should emit all valid files when multiple is true
- [ ] should not emit `filesSelected` when no files are dropped
- [ ] should not emit `filesSelected` when all files are rejected
- [ ] should include source as `drop` if event object includes a source field
- [ ] should reset drag state after successful drop

### Multiple Mode

- [ ] should accept a single file when multiple is false
- [ ] should accept all files when multiple is true
- [ ] should reject extra files when multiple is false and multiple files are dropped
- [ ] should emit accepted first file and rejected remaining files when multiple is false
- [ ] should preserve dropped file order while applying multiple validation

### Accept Validation - Extensions

- [ ] should accept a file matching a single extension accept value
- [ ] should reject a file not matching a single extension accept value
- [ ] should accept a file matching one of many extension accept values
- [ ] should support comma-separated extension accept values
- [ ] should ignore whitespace around comma-separated extension accept values
- [ ] should match extensions case-insensitively
- [ ] should support files with empty MIME type when extension matches

### Accept Validation - MIME Types

- [ ] should accept a file matching an exact MIME type
- [ ] should reject a file not matching an exact MIME type
- [ ] should accept a file matching one of many exact MIME types
- [ ] should match MIME types case-insensitively if implementation normalizes them
- [ ] should accept `image/png` when accept is `image/png`
- [ ] should reject `image/png` when accept is `application/pdf`

### Accept Validation - Wildcard MIME Types

- [ ] should accept `image/png` when accept is `image/*`
- [ ] should accept `image/jpeg` when accept is `image/*`
- [ ] should reject `application/pdf` when accept is `image/*`
- [ ] should accept `video/mp4` when accept is `video/*`
- [ ] should reject files with empty MIME type for wildcard MIME accept unless extension also matches

### Accept Validation - Mixed Accept Values

- [ ] should accept by extension when accept contains both extension and MIME values
- [ ] should accept by exact MIME type when accept contains both extension and MIME values
- [ ] should accept by wildcard MIME type when accept contains both extension and wildcard values
- [ ] should reject when no accept rule matches
- [ ] should treat empty accept string as no restriction
- [ ] should treat whitespace-only accept string as no restriction
- [ ] should support accept as a string array if implemented

### Max Size Validation

- [ ] should accept a file smaller than `maxSize`
- [ ] should accept a file exactly equal to `maxSize`
- [ ] should reject a file larger than `maxSize`
- [ ] should not apply size validation when `maxSize` is null
- [ ] should not apply size validation when `maxSize` is undefined
- [ ] should not apply size validation when `maxSize` is zero if zero is treated as no restriction
- [ ] should not apply size validation when `maxSize` is negative if negative is treated as no restriction
- [ ] should reject only oversized files when multiple files are dropped
- [ ] should still accept valid files when other files are oversized

### Rejected Files Output

- [ ] should emit `filesRejected` when a file fails type validation
- [ ] should emit `filesRejected` when a file fails size validation
- [ ] should emit `filesRejected` when a file fails multiple validation
- [ ] should include the rejected file in each rejection item
- [ ] should include reason `type` for type validation failures
- [ ] should include reason `size` for size validation failures
- [ ] should include reason `multiple` for multiple validation failures
- [ ] should include a non-empty message for each rejected file
- [ ] should emit accepted files together with rejected files if the event shape supports it
- [ ] should not emit `filesRejected` when all files are accepted

### Mixed Accepted / Rejected Files

- [ ] should emit selected files for accepted files when some files are rejected
- [ ] should emit rejected files for rejected files when some files are accepted
- [ ] should preserve accepted file order
- [ ] should preserve rejected file order
- [ ] should handle type and size rejection in the same drop event
- [ ] should prefer deterministic rejection reason when a file fails multiple validations
- [ ] should document or test the chosen validation priority

### Host Attribute Reflection

- [ ] should add `data-dragging` when drag state is dragging
- [ ] should remove `data-dragging` when drag state is idle
- [ ] should add `data-disabled` when disabled
- [ ] should remove `data-disabled` when enabled
- [ ] should add `data-rejected` when drag or drop state is rejected if implemented
- [ ] should remove `data-rejected` after state returns to idle if implemented
- [ ] should not overwrite user-defined ARIA attributes
- [ ] should not overwrite user-defined role
- [ ] should not overwrite user-defined tabindex

### Edge Cases

- [ ] should not throw when dropped file list is empty
- [ ] should not throw when dropped item is not a file
- [ ] should not throw when file name has no extension
- [ ] should not throw when file name has multiple dots
- [ ] should correctly detect extension from file names with multiple dots
- [ ] should handle uppercase file extensions
- [ ] should handle accept values with uppercase extensions
- [ ] should handle files with empty MIME type
- [ ] should handle files with unknown MIME type
- [ ] should handle rapid drag enter and drag leave events
- [ ] should handle repeated drop events

### Type Safety / Lint

- [ ] should compile with strict TypeScript settings
- [ ] should avoid `any`
- [ ] should avoid unused variables
- [ ] should export public types from the file-upload barrel
- [ ] should not expose private helper types unnecessarily
- [ ] should follow existing TailNG lint rules

### Integration / Public API

- [ ] should export `TngFileUploadDirective` from the feature index
- [ ] should export file upload event types from the feature index
- [ ] should export the file-upload feature from the primitives public API
- [ ] should allow importing the directive directly in a standalone host component
- [ ] should not require importing any styled component package

## Acceptance Criteria

The task is complete when:

- The directive is implemented under primitives.
- The directive is standalone.
- Drag/drop file selection works.
- Accept validation works for extension, exact MIME, and wildcard MIME values.
- Max size validation works.
- Multiple/single mode works.
- Disabled mode works.
- Drag state is reflected and emitted.
- Public exports are added.
- Unit tests cover the cases above.
- Tests pass using the existing workspace test command.
- Lint and type-check pass.
- No styled component or upload service is created.

## Suggested Commands

Use the project’s existing commands. If unavailable, infer from existing TailNG conventions.

Examples:

```bash
yarn nx test primitives
yarn nx lint primitives
```

Do not introduce unnecessary dependencies.
