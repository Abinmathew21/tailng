import {
  Directive,
  HostBinding,
  HostListener,
  booleanAttribute,
  input,
  output,
  signal,
} from '@angular/core';

import type {
  TngFileUploadDragState,
  TngFileUploadRejectedEvent,
  TngFileUploadSelectedEvent,
  TngFileUploadSource,
} from './tng-file-upload.types';
import {
  coerceTngFileUploadMaxSize,
  extractTngFileUploadFiles,
  normalizeTngFileUploadAccept,
  validateTngFileUploadFiles,
  type TngFileUploadAcceptInput,
  type TngFileUploadMaxSizeInput,
} from './tng-file-upload.utils';

/**
 * Headless drag-and-drop file selection directive.
 *
 * Attach `tngFileUpload` to any section-like host element (`div`, `section`,
 * `label`, ...) to turn it into a drop zone. The directive is unstyled and only
 * concerns itself with drag/drop handling, validation, and state reflection via
 * data attributes and outputs. It never sets a `role`, `tabindex`, or ARIA
 * attributes, so any consumer-provided accessibility metadata is preserved.
 *
 * @example
 * ```html
 * <div
 *   tngFileUpload
 *   [accept]="'.png,.jpg,.jpeg,.pdf'"
 *   [multiple]="true"
 *   [maxSize]="5 * 1024 * 1024"
 *   (filesSelected)="onFilesSelected($event)"
 *   (filesRejected)="onFilesRejected($event)"
 *   (dragStateChange)="onDragStateChange($event)"
 * >
 *   Drop files here
 * </div>
 * ```
 */
@Directive({
  selector: '[tngFileUpload]',
  exportAs: 'tngFileUpload',
})
export class TngFileUploadDirective {
  /** Accepted file types (extensions, exact MIME types, or wildcard MIME groups). */
  public readonly accept = input<readonly string[], TngFileUploadAcceptInput>([], {
    transform: normalizeTngFileUploadAccept,
  });

  /** Whether more than one file may be selected at once. */
  public readonly multiple = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  /** Maximum allowed file size in bytes. `null` (the default) means no limit. */
  public readonly maxSize = input<number | null, TngFileUploadMaxSizeInput>(null, {
    transform: coerceTngFileUploadMaxSize,
  });

  /** Whether the drop zone is disabled. Disabled drop zones are fully passive. */
  public readonly disabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });

  /** Emits the accepted files (and their source) when valid files are selected. */
  public readonly filesSelected = output<TngFileUploadSelectedEvent>();

  /** Emits the rejected files (with reasons) when files fail validation. */
  public readonly filesRejected = output<TngFileUploadRejectedEvent>();

  /** Emits whenever the drag interaction state changes. */
  public readonly dragStateChange = output<TngFileUploadDragState>();

  /** Reactive drag state used to drive host attribute reflection. */
  public readonly dragState = signal<TngFileUploadDragState>('idle');

  /**
   * Tracks nested drag enter/leave pairs so dragging over child elements does
   * not prematurely reset the drag state.
   */
  private dragDepth = 0;

  @HostBinding('attr.data-file-upload')
  protected readonly dataFileUploadAttr = '';

  @HostBinding('attr.data-dragging')
  protected get dataDraggingAttr(): '' | null {
    return this.dragState() === 'dragging' ? '' : null;
  }

  @HostBinding('attr.data-rejected')
  protected get dataRejectedAttr(): '' | null {
    return this.dragState() === 'rejected' ? '' : null;
  }

  @HostBinding('attr.data-disabled')
  protected get dataDisabledAttr(): '' | null {
    return this.disabled() ? '' : null;
  }

  @HostListener('dragenter', ['$event'])
  protected onDragEnter(...args: readonly unknown[]): void {
    const event = this.toDomEvent(args);
    if (event === null || this.disabled()) {
      return;
    }

    event.preventDefault();
    this.dragDepth += 1;
    this.setDragState('dragging');
  }

  @HostListener('dragover', ['$event'])
  protected onDragOver(...args: readonly unknown[]): void {
    const event = this.toDomEvent(args);
    if (event === null || this.disabled()) {
      return;
    }

    event.preventDefault();
    if (this.dragDepth === 0) {
      this.dragDepth = 1;
    }
    this.setDragState('dragging');
  }

  @HostListener('dragleave', ['$event'])
  protected onDragLeave(...args: readonly unknown[]): void {
    const event = this.toDomEvent(args);
    if (event === null || this.disabled()) {
      return;
    }

    if (this.dragDepth > 0) {
      this.dragDepth -= 1;
    }
    if (this.dragDepth === 0) {
      this.setDragState('idle');
    }
  }

  @HostListener('drop', ['$event'])
  protected onDrop(...args: readonly unknown[]): void {
    const event = this.toDomEvent(args);
    if (event === null || this.disabled()) {
      return;
    }

    event.preventDefault();
    this.dragDepth = 0;
    this.setDragState('idle');
    this.handleFiles(extractTngFileUploadFiles(event), 'drop');
  }

  private toDomEvent(args: readonly unknown[]): Event | null {
    const [event] = args;
    return event instanceof Event ? event : null;
  }

  private setDragState(next: TngFileUploadDragState): void {
    if (this.dragState() === next) {
      return;
    }

    this.dragState.set(next);
    this.dragStateChange.emit(next);
  }

  private handleFiles(files: readonly File[], source: TngFileUploadSource): void {
    if (files.length === 0) {
      return;
    }

    const { accepted, rejected } = validateTngFileUploadFiles(files, {
      accept: this.accept(),
      maxSize: this.maxSize(),
      multiple: this.multiple(),
    });

    if (accepted.length > 0) {
      this.filesSelected.emit({ files: accepted, source });
    }

    if (rejected.length > 0) {
      this.filesRejected.emit({ rejected, accepted, source });
    }
  }
}
