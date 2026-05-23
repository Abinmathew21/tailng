import { Component, ViewChild } from '@angular/core';
import type { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
      [accept]="accept"
      [multiple]="multiple"
      [maxSize]="maxSize"
      [disabled]="disabled"
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
  public accept: string | readonly string[] | null | undefined = undefined;
  public multiple: boolean | string = false;
  public maxSize: number | null | undefined = null;
  public disabled: boolean | string = false;

  public readonly selectedEvents: TngFileUploadSelectedEvent[] = [];
  public readonly rejectedEvents: TngFileUploadRejectedEvent[] = [];
  public readonly dragStates: TngFileUploadDragState[] = [];

  @ViewChild('zone', { static: true })
  public zone!: ElementRef<HTMLDivElement>;

  @ViewChild(TngFileUploadDirective, { static: true })
  public directive!: TngFileUploadDirective;
}

export type FileUploadFixture = {
  readonly component: FileUploadHostComponent;
  readonly element: HTMLDivElement;
  readonly detectChanges: () => void;
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
export function dispatchDrag(
  element: HTMLElement,
  type: 'dragenter' | 'dragover' | 'dragleave' | 'drop',
  files?: readonly File[] | null,
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true });

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
