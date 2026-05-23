import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';

import * as fileUploadFeature from '../index';
import { TngFileUploadDirective } from '../tng-file-upload';
import {
  createFileUploadFixture,
  dispatchDrag,
  dispatchDropWithNonFile,
  makeFile,
  type FileUploadFixture,
} from './tng-file-upload.test-helpers';

describe('TngFileUploadDirective', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('creation / basic setup', () => {
    it('creates the directive when applied to a host element', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive).toBeInstanceOf(TngFileUploadDirective);
    });

    it('exposes the directive as a standalone directive', () => {
      expect(typeof TngFileUploadDirective).toBe('function');
    });

    it('adds the base data-file-upload attribute to the host', () => {
      const { element } = createFileUploadFixture();
      expect(element.hasAttribute('data-file-upload')).toBe(true);
    });

    it('works on a div host element', () => {
      const { element } = createFileUploadFixture();
      expect(element.tagName).toBe('DIV');
    });

    it('works on a section host element', () => {
      @Component({
        imports: [TngFileUploadDirective],
        template: `<section tngFileUpload>Drop</section>`,
      })
      class SectionHost {}

      const fixture = TestBed.configureTestingModule({ imports: [SectionHost] }).createComponent(
        SectionHost,
      );
      fixture.detectChanges();
      const section = fixture.nativeElement.querySelector('section') as HTMLElement;
      expect(section.hasAttribute('data-file-upload')).toBe(true);
    });

    it('preserves existing host classes', () => {
      const { element } = createFileUploadFixture();
      expect(element.classList.contains('existing-class')).toBe(true);
      expect(element.classList.contains('extra-class')).toBe(true);
    });

    it('preserves existing host attributes', () => {
      const { element } = createFileUploadFixture();
      expect(element.getAttribute('data-consumer')).toBe('keep-me');
    });
  });

  describe('input defaults', () => {
    it('defaults accept to no restriction', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive.accept()).toEqual([]);
    });

    it('defaults multiple to false', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive.multiple()).toBe(false);
    });

    it('defaults maxSize to no restriction', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive.maxSize()).toBeNull();
    });

    it('defaults disabled to false', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive.disabled()).toBe(false);
    });

    it('treats null accept as no restriction', () => {
      const fixture = createFileUploadFixture();
      fixture.component.accept.set(null);
      fixture.detectChanges();
      expect(fixture.component.directive.accept()).toEqual([]);
    });

    it('treats null maxSize as no restriction', () => {
      const fixture = createFileUploadFixture();
      fixture.component.maxSize.set(null);
      fixture.detectChanges();
      expect(fixture.component.directive.maxSize()).toBeNull();
    });
  });

  describe('boolean input handling', () => {
    function setMultiple(value: boolean | string): FileUploadFixture {
      const fixture = createFileUploadFixture();
      fixture.component.multiple.set(value);
      fixture.detectChanges();
      return fixture;
    }

    it('treats [multiple]="true" as enabled', () => {
      expect(setMultiple(true).component.directive.multiple()).toBe(true);
    });

    it('treats [multiple]="false" as disabled', () => {
      expect(setMultiple(false).component.directive.multiple()).toBe(false);
    });

    it('treats a plain multiple attribute as enabled', () => {
      expect(setMultiple('').component.directive.multiple()).toBe(true);
    });

    it('treats [disabled]="true" as disabled', () => {
      const fixture = createFileUploadFixture();
      fixture.component.disabled.set(true);
      fixture.detectChanges();
      expect(fixture.component.directive.disabled()).toBe(true);
    });

    it('treats a plain disabled attribute as disabled', () => {
      const fixture = createFileUploadFixture();
      fixture.component.disabled.set('');
      fixture.detectChanges();
      expect(fixture.component.directive.disabled()).toBe(true);
    });
  });

  describe('host attribute reflection', () => {
    it('adds data-dragging while dragging and removes it when idle', () => {
      const { element, detectChanges } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      detectChanges();
      expect(element.hasAttribute('data-dragging')).toBe(true);

      dispatchDrag(element, 'dragleave');
      detectChanges();
      expect(element.hasAttribute('data-dragging')).toBe(false);
    });

    it('removes data-dragging after files are dropped', () => {
      const { element, detectChanges } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      detectChanges();
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      detectChanges();
      expect(element.hasAttribute('data-dragging')).toBe(false);
    });

    it('adds data-disabled when disabled and removes it when enabled', () => {
      const fixture = createFileUploadFixture();
      fixture.component.disabled.set(true);
      fixture.detectChanges();
      expect(fixture.element.hasAttribute('data-disabled')).toBe(true);

      fixture.component.disabled.set(false);
      fixture.detectChanges();
      expect(fixture.element.hasAttribute('data-disabled')).toBe(false);
    });

    it('does not overwrite a user-defined role', () => {
      const { element } = createFileUploadFixture();
      expect(element.getAttribute('role')).toBe('button');
    });

    it('does not overwrite a user-defined tabindex', () => {
      const { element } = createFileUploadFixture();
      expect(element.getAttribute('tabindex')).toBe('3');
    });

    it('does not overwrite a user-defined aria attribute', () => {
      const { element } = createFileUploadFixture();
      expect(element.getAttribute('aria-label')).toBe('Upload files');
    });
  });

  describe('drag state', () => {
    it('emits dragging on drag enter', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      expect(component.dragStates).toEqual(['dragging']);
    });

    it('emits dragging on drag over', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragover', [makeFile('a.png', 'image/png')]);
      expect(component.dragStates).toEqual(['dragging']);
    });

    it('emits idle on drag leave', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'dragleave');
      expect(component.dragStates).toEqual(['dragging', 'idle']);
    });

    it('emits idle after drop', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(component.dragStates).toEqual(['dragging', 'idle']);
    });

    it('does not repeatedly emit the same drag state', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'dragover', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'dragover', [makeFile('a.png', 'image/png')]);
      expect(component.dragStates).toEqual(['dragging']);
    });

    it('handles rapid drag enter and leave events with nested counting', () => {
      const { component, element, detectChanges } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'dragleave');
      detectChanges();
      expect(element.hasAttribute('data-dragging')).toBe(true);
      dispatchDrag(element, 'dragleave');
      expect(component.dragStates).toEqual(['dragging', 'idle']);
    });
  });

  describe('drag event behavior', () => {
    it('prevents default on drag enter when enabled', () => {
      const { element } = createFileUploadFixture();
      const event = dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      expect(event.defaultPrevented).toBe(true);
    });

    it('prevents default on drag over when enabled', () => {
      const { element } = createFileUploadFixture();
      const event = dispatchDrag(element, 'dragover', [makeFile('a.png', 'image/png')]);
      expect(event.defaultPrevented).toBe(true);
    });

    it('prevents default on drop when enabled', () => {
      const { element } = createFileUploadFixture();
      const event = dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not stop propagation (drop still bubbles)', () => {
      const { element } = createFileUploadFixture();
      let bubbled = false;
      (element.parentNode as HTMLElement | null)?.addEventListener('drop', () => {
        bubbled = true;
      });
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(bubbled).toBe(true);
    });

    it('does not throw when a drag event has no dataTransfer', () => {
      const { element } = createFileUploadFixture();
      expect(() => dispatchDrag(element, 'drop', null)).not.toThrow();
    });

    it('does not throw when dataTransfer has no files', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', []);
      expect(component.selectedEvents).toEqual([]);
    });

    it('resets drag state when a drop event has no files', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'dragenter', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'drop', []);
      expect(component.dragStates).toEqual(['dragging', 'idle']);
    });
  });

  describe('disabled state', () => {
    function disabledFixture(): FileUploadFixture {
      const fixture = createFileUploadFixture();
      fixture.component.disabled.set(true);
      fixture.detectChanges();
      return fixture;
    }

    it('does not prevent default on drag events when disabled (passive)', () => {
      const { element } = disabledFixture();
      const event = dispatchDrag(element, 'dragover', [makeFile('a.png', 'image/png')]);
      expect(event.defaultPrevented).toBe(false);
    });

    it('does not add data-dragging when disabled', () => {
      const fixture = disabledFixture();
      dispatchDrag(fixture.element, 'dragenter', [makeFile('a.png', 'image/png')]);
      fixture.detectChanges();
      expect(fixture.element.hasAttribute('data-dragging')).toBe(false);
    });

    it('does not emit dragStateChange when disabled', () => {
      const fixture = disabledFixture();
      dispatchDrag(fixture.element, 'dragenter', [makeFile('a.png', 'image/png')]);
      expect(fixture.component.dragStates).toEqual([]);
    });

    it('does not emit filesSelected when disabled', () => {
      const fixture = disabledFixture();
      dispatchDrag(fixture.element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(fixture.component.selectedEvents).toEqual([]);
    });

    it('does not emit filesRejected when disabled', () => {
      const fixture = disabledFixture();
      fixture.component.accept.set(['.pdf']);
      fixture.detectChanges();
      dispatchDrag(fixture.element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(fixture.component.rejectedEvents).toEqual([]);
    });
  });

  describe('file selection / drop', () => {
    it('emits filesSelected when a valid file is dropped', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(component.selectedEvents).toHaveLength(1);
      expect(component.selectedEvents[0].source).toBe('drop');
    });

    it('emits selected files in dropped order', () => {
      const fixture = createFileUploadFixture();
      fixture.component.multiple.set(true);
      fixture.detectChanges();
      const a = makeFile('a.png', 'image/png');
      const b = makeFile('b.png', 'image/png');
      dispatchDrag(fixture.element, 'drop', [a, b]);
      expect(fixture.component.selectedEvents[0].files).toEqual([a, b]);
    });

    it('emits one file when multiple is false and one valid file is dropped', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(component.selectedEvents[0].files).toHaveLength(1);
    });

    it('does not emit filesSelected when no files are dropped', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', []);
      expect(component.selectedEvents).toEqual([]);
    });

    it('does not emit filesSelected when all files are rejected', () => {
      const fixture = createFileUploadFixture();
      fixture.component.accept.set(['.pdf']);
      fixture.detectChanges();
      dispatchDrag(fixture.element, 'drop', [makeFile('a.png', 'image/png')]);
      expect(fixture.component.selectedEvents).toEqual([]);
      expect(fixture.component.rejectedEvents).toHaveLength(1);
    });
  });

  describe('multiple mode (DOM)', () => {
    it('rejects extra files with reason multiple when multiple is false', () => {
      const { component, element } = createFileUploadFixture();
      const first = makeFile('a.png', 'image/png');
      const second = makeFile('b.png', 'image/png');
      dispatchDrag(element, 'drop', [first, second]);
      expect(component.selectedEvents[0].files).toEqual([first]);
      expect(component.rejectedEvents[0].rejected[0].reason).toBe('multiple');
    });

    it('accepts all files when multiple is true', () => {
      const fixture = createFileUploadFixture();
      fixture.component.multiple.set(true);
      fixture.detectChanges();
      const a = makeFile('a.png', 'image/png');
      const b = makeFile('b.png', 'image/png');
      dispatchDrag(fixture.element, 'drop', [a, b]);
      expect(fixture.component.selectedEvents[0].files).toEqual([a, b]);
      expect(fixture.component.rejectedEvents).toEqual([]);
    });
  });

  describe('mixed accepted / rejected files', () => {
    it('emits accepted files alongside rejected files in one drop', () => {
      const fixture = createFileUploadFixture();
      fixture.component.multiple.set(true);
      fixture.component.accept.set(['image/*']);
      fixture.component.maxSize.set(100);
      fixture.detectChanges();

      const good = makeFile('a.png', 'image/png', 10);
      const wrongType = makeFile('b.txt', 'text/plain', 10);
      const tooBig = makeFile('c.png', 'image/png', 500);
      dispatchDrag(fixture.element, 'drop', [good, wrongType, tooBig]);

      expect(fixture.component.selectedEvents[0].files).toEqual([good]);
      const rejected = fixture.component.rejectedEvents[0];
      expect(rejected.accepted).toEqual([good]);
      expect(rejected.rejected.map((entry) => entry.reason)).toEqual(['type', 'size']);
    });
  });

  describe('edge cases (DOM)', () => {
    it('does not throw when the dropped item is not a file', () => {
      const { component, element } = createFileUploadFixture();
      expect(() => dispatchDropWithNonFile(element)).not.toThrow();
      expect(component.selectedEvents).toEqual([]);
    });

    it('handles repeated drop events', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', [makeFile('a.png', 'image/png')]);
      dispatchDrag(element, 'drop', [makeFile('b.png', 'image/png')]);
      expect(component.selectedEvents).toHaveLength(2);
    });

    it('accepts a file whose name has no extension when there is no type restriction', () => {
      const { component, element } = createFileUploadFixture();
      dispatchDrag(element, 'drop', [makeFile('noextension', '')]);
      expect(component.selectedEvents).toHaveLength(1);
    });
  });

  describe('integration / public API', () => {
    it('exports TngFileUploadDirective from the feature index', () => {
      expect(fileUploadFeature.TngFileUploadDirective).toBe(TngFileUploadDirective);
    });

    it('allows importing the directive directly in a standalone host component', () => {
      const { component } = createFileUploadFixture();
      expect(component.directive).toBeTruthy();
    });
  });
});
