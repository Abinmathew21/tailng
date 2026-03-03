import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngMultiAutocomplete } from '../tng-multi-autocomplete';

@Component({
  standalone: true,
  imports: [TngMultiAutocomplete],
  template: `<section tngMultiAutocomplete data-testid="host"></section>`,
})
class HostComponent {}

describe('tng-multi-autocomplete.state', () => {
  it('exports the multi-autocomplete primitive', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );
    expect(inst).toBeTruthy();
  });

  it('default state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    expect(inst.open()).toBe(false);
    expect(inst.disabled()).toBe(false);
    expect(inst.value()).toEqual([]);
    expect(inst.loading()).toBe(false);
    expect(inst.invalid()).toBe(false);
  });

  it('host bindings', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector(
      '[data-testid="host"]',
    ) as HTMLElement;

    expect(host.getAttribute('data-slot')).toBe('multi-autocomplete');
    expect(host.getAttribute('data-state')).toBe('closed');

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );
    inst.open.set(true);
    fixture.detectChanges();

    expect(host.getAttribute('data-state')).toBe('open');
  });

  it('openSelect() opens when not disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    inst.openSelect();
    expect(inst.open()).toBe(true);
  });

  it('openSelect() does nothing when disabled', () => {
    @Component({
      standalone: true,
      imports: [TngMultiAutocomplete],
      template: `<section tngMultiAutocomplete [disabled]="true"></section>`,
    })
    class DisabledHost {}

    const fixture = TestBed.configureTestingModule({
      imports: [DisabledHost],
    }).createComponent(DisabledHost);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    inst.openSelect();
    expect(inst.open()).toBe(false);
  });

  it('close() always closes', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    inst.open.set(true);
    inst.close();
    expect(inst.open()).toBe(false);
  });

  it('ID setters/getters', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    inst.setContentId('c');
    inst.setListboxId('l');
    inst.setActiveDescendantId('a');

    expect(inst.getContentId()).toBe('c');
    expect(inst.getListboxId()).toBe('l');
    expect(inst.getActiveDescendantId()).toBe('a');
  });

  it('listbox API bridge', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const inst = fixture.debugElement.children[0].injector.get(
      TngMultiAutocomplete<string>,
    );

    const api = { getActiveId: () => 'x' };
    inst.setListboxApi(api as any);

    expect(inst.getListboxApi()).toBeTruthy();

    inst.setListboxApi(null);
    expect(inst.getListboxApi()).toBe(null);
  });
});