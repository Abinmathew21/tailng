import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TngButtonToggleGroupComponent } from './tng-button-toggle-group.component';
import {
  TngButtonToggleComponent,
  toggleTngButtonToggleState,
} from './tng-button-toggle.component';

function click(el: HTMLElement): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
}

@Component({
  standalone: true,
  imports: [TngButtonToggleComponent],
  template: `
    <tng-button-toggle [pressed]="pressed()" (pressedChange)="pressed.set($event)">
      Bold
    </tng-button-toggle>
  `,
})
class StandaloneToggleHostComponent {
  readonly pressed = signal(false);
}

@Component({
  standalone: true,
  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],
  template: `
    <tng-button-toggle-group
      [type]="'multiple'"
      [orientation]="'vertical'"
      [disabled]="true"
      ariaLabel="Formatting options"
    >
      <tng-button-toggle [tngButtonToggleValue]="'left'">Left</tng-button-toggle>
      <tng-button-toggle [tngButtonToggleValue]="'center'">Center</tng-button-toggle>
      <tng-button-toggle [tngButtonToggleValue]="'right'">Right</tng-button-toggle>
    </tng-button-toggle-group>
  `,
})
class GroupToggleHostComponent {}

@Component({
  standalone: true,
  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],
  template: `
    <tng-button-toggle-group [type]="'single'" [value]="'left'">
      <tng-button-toggle
        [tngButtonToggleValue]="'left'"
        (pressedChange)="onStandalonePressedChange($event)"
      >
        Left
      </tng-button-toggle>
      <tng-button-toggle [tngButtonToggleValue]="'center'">Center</tng-button-toggle>
    </tng-button-toggle-group>
  `,
})
class GroupStandaloneGuardHostComponent {
  readonly onStandalonePressedChange = vi.fn<(next: boolean) => void>();
}

describe('tng-button-toggle component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports button toggle components', () => {
    expect(typeof TngButtonToggleComponent).toBe('function');
    expect(typeof TngButtonToggleGroupComponent).toBe('function');
  });

  it('toggles state', () => {
    expect(toggleTngButtonToggleState(true)).toBe(false);
    expect(toggleTngButtonToggleState(false)).toBe(true);
  });

  it('standalone wrapper emits pressedChange when clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [StandaloneToggleHostComponent],
    }).createComponent(StandaloneToggleHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const toggleButton = fixture.nativeElement.querySelector('[data-slot="button-toggle"]') as
      | HTMLButtonElement
      | null;
    expect(toggleButton).toBeTruthy();
    expect(host.pressed()).toBe(false);

    click(toggleButton!);
    fixture.detectChanges();

    expect(host.pressed()).toBe(true);
  });

  it('group wrapper forwards primitive state attributes and disabled semantics', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GroupToggleHostComponent],
    }).createComponent(GroupToggleHostComponent);
    fixture.detectChanges();

    const group = fixture.nativeElement.querySelector(
      '[data-slot="button-toggle-group"]',
    ) as HTMLElement | null;
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('[data-slot="button-toggle"]'),
    ) as HTMLButtonElement[];

    expect(group).toBeTruthy();
    expect(group?.getAttribute('data-type')).toBe('multiple');
    expect(group?.getAttribute('data-orientation')).toBe('vertical');
    expect(group?.getAttribute('data-disabled')).toBe('true');
    expect(group?.getAttribute('role')).toBe('group');
    expect(group?.getAttribute('aria-label')).toBe('Formatting options');

    expect(buttons).toHaveLength(3);
    expect(buttons[0]?.getAttribute('data-slot')).toBe('button-toggle');
  });

  it('inside group, wrapper does not emit standalone pressedChange', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GroupStandaloneGuardHostComponent],
    }).createComponent(GroupStandaloneGuardHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const firstButton = fixture.nativeElement.querySelector('[data-slot="button-toggle"]') as
      | HTMLButtonElement
      | null;
    expect(firstButton).toBeTruthy();

    click(firstButton!);
    fixture.detectChanges();

    expect(host.onStandalonePressedChange).not.toHaveBeenCalled();
  });
});
