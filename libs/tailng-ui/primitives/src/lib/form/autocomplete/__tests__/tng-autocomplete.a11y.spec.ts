import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngAutocomplete,
  TngAutocompleteContent,
  TngAutocompleteListbox,
  TngAutocompleteOption,
  TngAutocompleteOverlay,
  TngAutocompleteTrigger,
} from '../index';

function focus(el: HTMLElement): void {
  el.focus();
}

@Component({
  imports: [
    TngAutocomplete,
    TngAutocompleteTrigger,
    TngAutocompleteContent,
    TngAutocompleteOverlay,
    TngAutocompleteListbox,
    TngAutocompleteOption,
  ],
  template: `
    <div
      tngAutocomplete
      #api="tngAutocomplete"
      [open]="open()"
      (openChange)="open.set($event)"
      [value]="value()"
      (valueChange)="value.set($event)"
      [labelId]="labelId()"
      [descriptionId]="descriptionId()"
      [errorId]="errorId()"
      [invalid]="invalid()"
      data-testid="autocomplete"
    >
      <input tngAutocompleteTrigger type="text" data-testid="trigger" />

      <div tngAutocompleteContent data-testid="content">
        <div tngAutocompleteOverlay data-testid="overlay">
          <ul
            tngAutocompleteListbox
            [value]="api.value()"
            (valueChange)="api.value.set($event)"
            data-testid="listbox"
          >
            <li tngAutocompleteOption [tngValue]="'a'" data-testid="opt-a">A</li>
            <li tngAutocompleteOption [tngValue]="'b'" data-testid="opt-b">B</li>
            <li tngAutocompleteOption [tngValue]="'c'" data-testid="opt-c">C</li>
          </ul>
        </div>
      </div>
    </div>
  `,
})
class A11yHostComponent {
  @ViewChild('api', { static: true }) api!: TngAutocomplete<string>;
  open = signal(false);
  value = signal<string | null>(null);
  labelId = signal<string | null>(null);
  descriptionId = signal<string | null>(null);
  errorId = signal<string | null>(null);
  invalid = signal(false);
}

async function openAutocomplete(
  fixture: { detectChanges: () => void },
  trigger: HTMLElement
): Promise<void> {
  focus(trigger);
  fixture.detectChanges();
  await Promise.resolve();
  fixture.detectChanges();
}

describe('tng-autocomplete.a11y', () => {
  describe('role="combobox" on input', () => {
    it('trigger has role combobox', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('role')).toBe('combobox');
    });
  });

  describe('aria-expanded reflects open state', () => {
    it('aria-expanded is false when closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('aria-expanded is true when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

      await openAutocomplete(fixture, trigger);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('aria-controls points to content id', () => {
    it('aria-controls is null when closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-controls')).toBeNull();
    });

    it('aria-controls points to content id when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

      await openAutocomplete(fixture, trigger);

      const contentId = host.api.getContentId();
      expect(contentId).toBeTruthy();
      expect(trigger.getAttribute('aria-controls')).toBe(contentId);
    });
  });

  describe('aria-activedescendant reflects active id', () => {
    it('aria-activedescendant is null when closed', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('aria-activedescendant reflects active option id when open', async () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;

      await openAutocomplete(fixture, trigger);

      const activeId = trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      expect(activeId).toMatch(/^tng-option-/);
    });
  });

  describe('aria-labelledby uses labelId', () => {
    it('aria-labelledby is null when labelId not set', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-labelledby')).toBeNull();
    });

    it('aria-labelledby matches labelId when set', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.labelId.set('my-label-id');
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-labelledby')).toBe('my-label-id');
    });
  });

  describe('aria-describedby includes descriptionId', () => {
    it('aria-describedby is null when descriptionId and errorId not set', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-describedby')).toBeNull();
    });

    it('aria-describedby includes descriptionId when set', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.descriptionId.set('my-desc-id');
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-describedby')).toContain('my-desc-id');
    });
  });

  describe('When invalid=true', () => {
    it('aria-describedby includes errorId', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.invalid.set(true);
      host.errorId.set('my-error-id');
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-describedby')).toContain('my-error-id');
    });

    it('aria-invalid is true', () => {
      const fixture = TestBed.configureTestingModule({
        imports: [A11yHostComponent],
      }).createComponent(A11yHostComponent);

      fixture.detectChanges();

      const host = fixture.componentInstance;
      host.invalid.set(true);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('[data-testid="trigger"]') as HTMLElement;
      expect(trigger.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
