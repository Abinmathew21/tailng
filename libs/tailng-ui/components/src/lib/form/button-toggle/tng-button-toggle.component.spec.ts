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
  imports: [TngButtonToggleComponent],
  template: `
    <tng-button-toggle [pressed]="pressed()" (pressedChange)="pressed.set($event)">
      Bold
    </tng-button-toggle>
  `,
})
class StandaloneToggleHostComponent {
  public readonly pressed = signal(false);
}

@Component({
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
class GroupToggleHostComponent { }

@Component({
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
  public readonly onStandalonePressedChange = vi.fn<(next: boolean) => void>();
}

@Component({
  imports: [TngButtonToggleComponent, TngButtonToggleGroupComponent],
  template: `
    <tng-button-toggle-group [type]="'single'" [value]="value()" (valueChange)="value.set($event)">
      <tng-button-toggle [tngButtonToggleValue]="'left'">Left</tng-button-toggle>
      <tng-button-toggle [tngButtonToggleValue]="'center'">Center</tng-button-toggle>
      <tng-button-toggle [tngButtonToggleValue]="'right'">Right</tng-button-toggle>
    </tng-button-toggle-group>
  `,
})
class GroupSelectionHostComponent {
  public readonly value = signal<'left' | 'center' | 'right' | null>('left');
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
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '[data-slot="button-toggle"]'),
    );

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

  it('reflects initial grouped selection on the rendered toggle button', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GroupSelectionHostComponent],
    }).createComponent(GroupSelectionHostComponent);
    fixture.detectChanges();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '[data-slot="button-toggle"]'),
    );

    expect(buttons).toHaveLength(3);
    expect(buttons[0]?.getAttribute('data-selected')).toBe('true');
    expect(buttons[1]?.getAttribute('data-selected')).toBe('false');
    expect(buttons[2]?.getAttribute('data-selected')).toBe('false');
  });

  it('updates grouped selection when a wrapped toggle is clicked', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [GroupSelectionHostComponent],
    }).createComponent(GroupSelectionHostComponent);
    fixture.detectChanges();

    const host = fixture.componentInstance;
    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
        '[data-slot="button-toggle"]'),
    );

    expect(buttons).toHaveLength(3);

    click(buttons[1]);
    fixture.detectChanges();

    expect(host.value()).toBe('center');
    expect(buttons[0]?.getAttribute('data-selected')).toBe('false');
    expect(buttons[1]?.getAttribute('data-selected')).toBe('true');
    expect(buttons[2]?.getAttribute('data-selected')).toBe('false');
  });
});
