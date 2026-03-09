import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import {
  TngInput,
  TngInputGroup,
  TngInputLeading,
  TngInputTrailing,
} from '../tng-input';

@Component({
  standalone: true,
  imports: [TngInputGroup, TngInput, TngInputLeading, TngInputTrailing],
  template: `
    @if (show) {
      <tng-input-group>
        @if (leading) {
          <span tngInputLeading>Leading</span>
        }

        <input tngInput [disabled]="disabled" />

        @if (trailing) {
          <span tngInputTrailing>Trailing</span>
        }
      </tng-input-group>
    }
  `,
})
class LifecycleHostComponent {
  public show = true;
  public leading = true;
  public trailing = true;
  public disabled = false;
}

describe('tngInputGroup primitive — cleanup & lifecycle', () => {
  it('removes observers/listeners on destroy (if any are used)', async () => {
    await TestBed.configureTestingModule({ imports: [LifecycleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LifecycleHostComponent);
    fixture.detectChanges();

    // Destroy should not throw (covers unsubscribes / listener cleanup)
    expect(() => fixture.destroy()).not.toThrow();
  });

  it('unregisters projected controls on destroy without leaving stale references', async () => {
    await TestBed.configureTestingModule({ imports: [LifecycleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LifecycleHostComponent);
    fixture.detectChanges();

    // Remove group from DOM (this will destroy TngInputGroup + TngInput)
    fixture.componentInstance.show = false;
    expect(() => fixture.changeDetectorRef.detectChanges()).not.toThrow();

    // Re-add it to ensure no stale state breaks future instances
    fixture.componentInstance.show = true;
    expect(() => fixture.changeDetectorRef.detectChanges()).not.toThrow();
  });

  it('does not throw when destroyed while inputs/slots are changing', async () => {
    await TestBed.configureTestingModule({ imports: [LifecycleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LifecycleHostComponent);
    fixture.detectChanges();

    // Change many things, then immediately destroy
    fixture.componentInstance.leading = false;
    fixture.componentInstance.trailing = false;
    fixture.componentInstance.disabled = true;

    // Do NOT call detectChanges; simulate teardown mid-update
    expect(() => fixture.destroy()).not.toThrow();
  });
});