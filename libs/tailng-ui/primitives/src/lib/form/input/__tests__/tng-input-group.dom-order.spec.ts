import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import {
  TngInput,
  TngInputGroup,
  TngInputLeading,
  TngInputTrailing,
} from '../tng-input';

@Component({
  imports: [TngInputGroup, TngInput, TngInputLeading, TngInputTrailing],
  template: `
    <tng-input-group>
      <span tngInputLeading>
        <span class="lead-a">A</span>
        <span class="lead-b">B</span>
      </span>

      <input tngInput />

      <span tngInputTrailing>
        <span class="trail-x">X</span>
        <span class="trail-y">Y</span>
      </span>
    </tng-input-group>
  `,
})
class DomOrderHostComponent {}

@Component({
  imports: [TngInputGroup, TngInput, TngInputLeading, TngInputTrailing],
  template: `
    <tng-input-group>
      @if (showLeading) {
        <span tngInputLeading><span class="lead">L</span></span>
      }

      <input tngInput />

      @if (showTrailing) {
        <span tngInputTrailing><span class="trail">T</span></span>
      }
    </tng-input-group>
  `,
})
class NoDupesHostComponent {
  public showLeading = true;
  public showTrailing = true;
}

function comesBefore(a: Node, b: Node): boolean {
  return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('tngInputGroup primitive — DOM order & projection contract', () => {
  it('renders leading slot before the control in the DOM', async () => {
    await TestBed.configureTestingModule({ imports: [DomOrderHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DomOrderHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    const leadingWrapper = host.querySelector('[data-slot="input-group-leading"]');
    const controlWrapper = host.querySelector('[data-slot="input-group-control"]');

    expect(leadingWrapper).toBeTruthy();
    expect(controlWrapper).toBeTruthy();
    expect(comesBefore(leadingWrapper!, controlWrapper!)).toBe(true);
  });

  it('renders trailing slot after the control in the DOM', async () => {
    await TestBed.configureTestingModule({ imports: [DomOrderHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DomOrderHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;
    const controlWrapper = host.querySelector('[data-slot="input-group-control"]');
    const trailingWrapper = host.querySelector('[data-slot="input-group-trailing"]');

    expect(controlWrapper).toBeTruthy();
    expect(trailingWrapper).toBeTruthy();
    expect(comesBefore(controlWrapper!, trailingWrapper!)).toBe(true);
  });

  it('preserves projection order of nested content inside leading/trailing slots', async () => {
    await TestBed.configureTestingModule({ imports: [DomOrderHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(DomOrderHostComponent);
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    const leadA = host.querySelector('.lead-a')!;
    const leadB = host.querySelector('.lead-b')!;
    const trailX = host.querySelector('.trail-x')!;
    const trailY = host.querySelector('.trail-y')!;

    expect(comesBefore(leadA, leadB)).toBe(true);
    expect(comesBefore(trailX, trailY)).toBe(true);
  });

  it('does not duplicate projected nodes on rerender', async () => {
    await TestBed.configureTestingModule({ imports: [NoDupesHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(NoDupesHostComponent);
    fixture.detectChanges();

    const host = () =>
      fixture.debugElement.query(By.css('tng-input-group')).nativeElement as HTMLElement;

    expect(host().querySelectorAll('.lead').length).toBe(1);
    expect(host().querySelectorAll('.trail').length).toBe(1);

    // Force multiple rerenders / toggles
    fixture.componentInstance.showLeading = false;
    fixture.changeDetectorRef.detectChanges();
    fixture.componentInstance.showLeading = true;
    fixture.changeDetectorRef.detectChanges();

    fixture.componentInstance.showTrailing = false;
    fixture.changeDetectorRef.detectChanges();
    fixture.componentInstance.showTrailing = true;
    fixture.changeDetectorRef.detectChanges();

    expect(host().querySelectorAll('.lead').length).toBe(1);
    expect(host().querySelectorAll('.trail').length).toBe(1);
  });
});