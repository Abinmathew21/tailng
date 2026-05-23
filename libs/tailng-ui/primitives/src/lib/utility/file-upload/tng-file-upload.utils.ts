import type {
  TngFileUploadRejectedFile,
  TngFileUploadRejectReason,
} from './tng-file-upload.types';

/** Accepted shapes for the `accept` input before normalization. */
export type TngFileUploadAcceptInput = string | readonly string[] | null | undefined;

/** Accepted shapes for the `maxSize` input before coercion. */
export type TngFileUploadMaxSizeInput = number | string | null | undefined;

/** Options consumed by {@link validateTngFileUploadFiles}. */
export type TngFileUploadValidationOptions = {
  readonly accept: readonly string[];
  readonly maxSize: number | null;
  readonly multiple: boolean;
};

/** Result of running validation over a list of files. */
export type TngFileUploadValidationResult = {
  readonly accepted: File[];
  readonly rejected: TngFileUploadRejectedFile[];
};

/**
 * Normalize the `accept` input into a deduplicated list of lower-cased,
 * trimmed tokens. Accepts a single comma-separated string or an array of
 * tokens (each of which may itself be comma-separated). Empty / whitespace
 * only values produce an empty list, which means "no restriction".
 */
export function normalizeTngFileUploadAccept(value: TngFileUploadAcceptInput): readonly string[] {
  if (value === null || value === undefined) {
    return [];
  }

  const rawTokens = typeof value === 'string' ? [value] : value;
  const tokens = rawTokens
    .flatMap((entry) => entry.split(','))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0);

  return [...new Set(tokens)];
}

/**
 * Coerce the `maxSize` input into a positive byte count, or `null` when no
 * size restriction should be applied. Zero, negative, and non-finite values
 * are treated as "no restriction".
 */
export function coerceTngFileUploadMaxSize(value: TngFileUploadMaxSizeInput): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
}

/**
 * Extract the lower-cased file extension (including the leading dot) from a
 * file name, or an empty string when the name has no usable extension.
 * Handles names with multiple dots by returning only the final segment, and
 * treats dot-prefixed names without a real extension (e.g. `.gitignore`) as
 * having no extension.
 */
export function getTngFileUploadExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot <= 0) {
    return '';
  }

  return fileName.slice(lastDot).toLowerCase();
}

function tokenMatchesFile(token: string, file: File): boolean {
  const fileType = file.type.toLowerCase();

  if (token.startsWith('.')) {
    return getTngFileUploadExtension(file.name) === token;
  }

  if (token.endsWith('/*')) {
    if (fileType.length === 0) {
      return false;
    }
    const group = token.slice(0, token.length - 1);
    return fileType.startsWith(group);
  }

  if (token.includes('/')) {
    return fileType.length > 0 && fileType === token;
  }

  return false;
}

/**
 * Determine whether a file satisfies any of the normalized accept tokens.
 * An empty token list means "no restriction" and always matches.
 */
export function matchesTngFileUploadAccept(file: File, accept: readonly string[]): boolean {
  if (accept.length === 0) {
    return true;
  }

  return accept.some((token) => tokenMatchesFile(token, file));
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

/**
 * Convert an unknown array-like value (typically a `FileList`) into a real
 * array of `File` instances, ignoring any non-file entries. Returns an empty
 * array for `null`/`undefined` or non array-like values.
 */
export function normalizeTngFileUploadFiles(list: unknown): File[] {
  if (list === null || list === undefined) {
    return [];
  }

  const arrayLike = list as ArrayLike<unknown>;
  const length = typeof arrayLike.length === 'number' ? arrayLike.length : 0;

  const files: File[] = [];
  for (let index = 0; index < length; index += 1) {
    const item = arrayLike[index];
    if (isFile(item)) {
      files.push(item);
    }
  }

  return files;
}

/**
 * Pull the dropped files out of a DOM event's `dataTransfer`, defensively
 * handling events that lack a `dataTransfer` or `files` collection. Uses
 * structural access rather than `instanceof DragEvent`/`DataTransfer` so it
 * works in environments (such as jsdom) where those globals are absent.
 */
export function extractTngFileUploadFiles(event: Event): File[] {
  const dataTransfer = (event as { dataTransfer?: { files?: unknown } | null }).dataTransfer;
  if (dataTransfer === null || dataTransfer === undefined) {
    return [];
  }

  return normalizeTngFileUploadFiles(dataTransfer.files);
}

function rejectedFile(
  file: File,
  reason: TngFileUploadRejectReason,
  message: string,
): TngFileUploadRejectedFile {
  return { file, reason, message };
}

/**
 * Validate a list of files against the accept, size, and multiplicity rules.
 *
 * Validation priority is deterministic: each file is checked for `type`, then
 * `size`. Only files that pass both are considered for acceptance. When
 * `multiple` is false, the first otherwise-valid file is accepted and any
 * further otherwise-valid files are rejected with reason `multiple`. Original
 * input order is preserved within both the accepted and rejected lists.
 */
export function validateTngFileUploadFiles(
  files: readonly File[],
  options: TngFileUploadValidationOptions,
): TngFileUploadValidationResult {
  const { accept, maxSize, multiple } = options;

  const accepted: File[] = [];
  const rejected: TngFileUploadRejectedFile[] = [];

  for (const file of files) {
    if (!matchesTngFileUploadAccept(file, accept)) {
      rejected.push(
        rejectedFile(file, 'type', `File "${file.name}" does not match the accepted file types.`),
      );
      continue;
    }

    if (maxSize !== null && file.size > maxSize) {
      rejected.push(
        rejectedFile(
          file,
          'size',
          `File "${file.name}" exceeds the maximum allowed size of ${maxSize} bytes.`,
        ),
      );
      continue;
    }

    if (!multiple && accepted.length >= 1) {
      rejected.push(
        rejectedFile(file, 'multiple', `File "${file.name}" was rejected because only one file is allowed.`),
      );
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejected };
}
