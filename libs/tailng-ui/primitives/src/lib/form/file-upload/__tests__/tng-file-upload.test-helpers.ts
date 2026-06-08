import { Component, ViewChild, signal } from '@angular/core';
import type { ElementRef } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { TngFileUploadDirective } from '../tng-file-upload';
import type {
  TngFileUploadDragState,
  TngFileUploadRejectedEvent,
  TngFileUploadSelectedEvent,
} from '../tng-file-upload.types';

/**
 * Host component exercising the directive with bindable inputs and output
 * collectors. Provides existing class / attribute / a11y metadata so tests can
 * confirm the directive preserves consumer state.
 */
@Component({
  imports: [TngFileUploadDirective],
  template: `
    <div
      #zone
      tngFileUpload
      [accept]="accept()"
      [multiple]="multiple()"
      [maxSize]="maxSize()"
      [disabled]="disabled()"
      (filesSelected)="selectedEvents.push($event)"
      (filesRejected)="rejectedEvents.push($event)"
      (dragStateChange)="dragStates.push($event)"
      class="existing-class extra-class"
      data-consumer="keep-me"
      role="button"
      tabindex="3"
      aria-label="Upload files"
    >
      Drop files here
    </div>
  `,
})
export class FileUploadHostComponent {
  public readonly accept = signal<string | readonly string[] | null | undefined>(undefined);
  public readonly multiple = signal<boolean | string>(false);
  public readonly maxSize = signal<number | null | undefined>(null);
  public readonly disabled = signal<boolean | string>(false);

  public readonly selectedEvents: TngFileUploadSelectedEvent[] = [];
  public readonly rejectedEvents: TngFileUploadRejectedEvent[] = [];
  public readonly dragStates: TngFileUploadDragState[] = [];

  @ViewChild('zone', { static: true })
  public zone!: ElementRef<HTMLDivElement>;

  @ViewChild(TngFileUploadDirective, { static: true })
  public directive!: TngFileUploadDirective;
}

/**
 * Host mirroring docs examples: signal-driven status text and decorative child
 * elements inside the drop zone.
 */
@Component({
  imports: [TngFileUploadDirective],
  template: `
    <div
      #zone
      tngFileUpload
      (filesSelected)="onSelected($event)"
    >
      <span #child class="drop-zone-child">Drop here</span>
    </div>
    @if (files().length > 0) {
      <p data-testid="upload-status">Accepted: {{ files()[0]?.name }}</p>
    }
  `,
})
export class FileUploadSignalHostComponent {
  public readonly files = signal<readonly File[]>([]);

  @ViewChild('zone', { static: true })
  public zone!: ElementRef<HTMLDivElement>;

  @ViewChild('child', { static: true })
  public child!: ElementRef<HTMLSpanElement>;

  protected onSelected(event: TngFileUploadSelectedEvent): void {
    this.files.set(event.files);
  }
}

export type FileUploadFixture = {
  readonly component: FileUploadHostComponent;
  readonly element: HTMLDivElement;
  readonly detectChanges: () => void;
};

export type FileUploadSignalFixture = {
  readonly component: FileUploadSignalHostComponent;
  readonly element: HTMLDivElement;
  readonly child: HTMLSpanElement;
  readonly nativeElement: HTMLElement;
  readonly detectChanges: () => void;
  readonly fixture: ComponentFixture<FileUploadSignalHostComponent>;
};

export function createFileUploadFixture(): FileUploadFixture {
  const fixture = TestBed.configureTestingModule({
    imports: [FileUploadHostComponent],
  }).createComponent(FileUploadHostComponent);

  fixture.detectChanges();

  return {
    component: fixture.componentInstance,
    element: fixture.componentInstance.zone.nativeElement,
    detectChanges: () => fixture.detectChanges(),
  };
}

export function createFileUploadSignalFixture(): FileUploadSignalFixture {
  const fixture = TestBed.configureTestingModule({
    imports: [FileUploadSignalHostComponent],
  }).createComponent(FileUploadSignalHostComponent);

  fixture.autoDetectChanges(true);

  return {
    component: fixture.componentInstance,
    element: fixture.componentInstance.zone.nativeElement,
    child: fixture.componentInstance.child.nativeElement,
    nativeElement: fixture.nativeElement as HTMLElement,
    detectChanges: () => fixture.detectChanges(),
    fixture,
  };
}

/** Build a `File` of an exact byte size with the given name and MIME type. */
export function makeFile(name: string, type = '', size = 8): File {
  return new File([new Uint8Array(Math.max(0, size))], name, { type });
}

/**
 * Dispatch a drag-family event on the element with an optional list of files.
 * Uses a plain `Event` with a structurally-shaped `dataTransfer` so it works in
 * jsdom (which lacks `DragEvent`/`DataTransfer`). Returns the dispatched event
 * so callers can assert on `defaultPrevented`.
 *
 * Pass `files` as `null` to omit `dataTransfer` entirely.
 */
export type DispatchDragOptions = Readonly<{
  relatedTarget?: EventTarget | null;
}>;

export function dispatchDrag(
  element: HTMLElement,
  type: 'dragenter' | 'dragover' | 'dragleave' | 'drop',
  files?: readonly File[] | null,
  options?: DispatchDragOptions,
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });

  if (options?.relatedTarget !== undefined) {
    Object.defineProperty(event, 'relatedTarget', {
      configurable: true,
      value: options.relatedTarget,
    });
  }

  if (files !== null) {
    Object.defineProperty(event, 'dataTransfer', {
      configurable: true,
      value: { files: files ?? [], types: ['Files'] },
    });
  }

  element.dispatchEvent(event);
  return event;
}

/** Dispatch a drop event whose `dataTransfer.files` contains a non-file entry. */
export function dispatchDropWithNonFile(element: HTMLElement): Event {
  const event = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', {
    configurable: true,
    value: { files: [{ notAFile: true }], types: ['Files'] },
  });
  element.dispatchEvent(event);
  return event;
}
