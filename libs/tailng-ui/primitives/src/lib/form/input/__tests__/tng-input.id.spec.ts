import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TngInput } from '../tng-input';
import { provideTngUniqueId } from '../../_shared/id'; // adjust path to your shared id provider

@Component({
  standalone: true,
  imports: [TngInput],
  template: `<input tngInput [attr.id]="id" />`,
})
class IdHostComponent {
  public id: string | null = null;
}

@Component({
  standalone: true,
  imports: [TngInput],
  template: `
    <input tngInput />
    <input tngInput />
    <input tngInput />
  `,
})
class MultiIdHostComponent {}

describe('tngInput primitive — ID behavior', () => {
  it('preserves a user-provided id and does not overwrite it', async () => {
    await TestBed.configureTestingModule({ imports: [IdHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(IdHostComponent);
    fixture.componentInstance.id = 'user-id';
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('id')).toBe('user-id');
  });

  it('generates a stable id when none is provided', async () => {
    await TestBed.configureTestingModule({
      imports: [IdHostComponent],
      // make generator deterministic so tests don't depend on execution order
      providers: [provideTngUniqueId((prefix) => `${prefix}-1`)],
    }).compileComponents();

    const fixture = TestBed.createComponent(IdHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    expect(el.getAttribute('id')).toBe('tng-input-1');
  });

  it('does not generate duplicate ids across multiple input instances', async () => {
    let n = 0;

    await TestBed.configureTestingModule({
      imports: [MultiIdHostComponent],
      providers: [
        provideTngUniqueId((prefix) => {
          n += 1;
          return `${prefix}-${n}`;
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(MultiIdHostComponent);
    fixture.detectChanges();

    const els = fixture.debugElement.queryAll(By.css('input')).map((d) => d.nativeElement as HTMLInputElement);
    const ids = els.map((e) => e.getAttribute('id'));

    expect(ids.length).toBe(3);
    expect(new Set(ids).size).toBe(3);
  });

  it('keeps generated id stable across rerenders', async () => {
    let n = 0;

    await TestBed.configureTestingModule({
      imports: [IdHostComponent],
      providers: [
        provideTngUniqueId((prefix) => {
          // generator is still monotonic, but the element should keep its first assigned id
          n += 1;
          return `${prefix}-${n}`;
        }),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(IdHostComponent);
    fixture.detectChanges();

    const el = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const first = el.getAttribute('id');

    // trigger rerender
    fixture.detectChanges();
    const second = el.getAttribute('id');

    expect(second).toBe(first);
  });
});