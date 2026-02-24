import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngSelect } from './tng-select';
import { TngSelectContent, TngSelectTrigger } from './tng-select.parts';

@Component({
  standalone: true,
  imports: [TngSelect, TngSelectTrigger, TngSelectContent],
  template: `
    <button
      tngSelect
      #select="tngSelect"
      [open]="open()"
      (openChange)="open.set($event)"
      [disabled]="disabled()"
      data-testid="select"
    >
      <span tngSelectTrigger data-testid="trigger">Trigger</span>

      <div tngSelectContent data-testid="content">
        Content
      </div>
    </button>
  `,
})
class HostComponent {
  @ViewChild('select', { static: true }) select!: TngSelect;

  open = signal(false);
  disabled = signal(false);
}

describe('tng-select content primitive', () => {
  it('keeps content mounted but hidden when closed', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector(
      '[data-testid="content"]',
    ) as HTMLElement;

    // Mounted
    expect(content).toBeTruthy();

    // Closed => hidden
    expect(content.hasAttribute('hidden')).toBe(true);
    expect(content.getAttribute('data-state')).toBe('closed');
  });

  it('removes hidden when open and updates data-state', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const content = fixture.nativeElement.querySelector(
      '[data-testid="content"]',
    ) as HTMLElement;

    host.open.set(true);
    fixture.detectChanges();

    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.getAttribute('data-state')).toBe('open');
  });

  it('exposes slot attribute for Tailwind styling', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector(
      '[data-testid="content"]',
    ) as HTMLElement;

    expect(content.getAttribute('data-slot')).toBe('select-content');
  });
});