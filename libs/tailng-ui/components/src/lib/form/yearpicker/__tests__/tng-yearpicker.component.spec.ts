import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { TngYearpickerComponent } from '../tng-yearpicker.component';

async function settle(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

async function waitForAnimationFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);
  if (element === null) {
    throw new Error(`Expected selector ${selector} to exist.`);
  }

  return element as T;
}

@Component({
  imports: [TngYearpickerComponent],
  template: `
    <tng-yearpicker
      [defaultValue]="defaultValue()"
      (valueChange)="valueChanges.push($event)"
    />
  `,
})
class YearpickerHostComponent {
  public readonly defaultValue = signal(2024);
  public readonly valueChanges: number[] = [];
}

describe('tng-yearpicker component', () => {
  it('uses the yearpicker selector and displays only the year in the input', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [YearpickerHostComponent],
    }).createComponent(YearpickerHostComponent);

    await settle(fixture);

    const input = getRequired<HTMLInputElement>(fixture.nativeElement, '[data-slot="datepicker-input"]');
    expect(input.value).toBe('2024');
  });

  it('opens directly to year selection and emits a numeric year', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [YearpickerHostComponent],
    }).createComponent(YearpickerHostComponent);

    await settle(fixture);

    getRequired<HTMLButtonElement>(fixture.nativeElement, '[data-slot="datepicker-trigger"]').click();
    await settle(fixture);
    await waitForAnimationFrame();
    await settle(fixture);

    const yearButton = Array.from(document.body.querySelectorAll<HTMLButtonElement>('[data-slot="datepicker-year"]')).find(
      (button) => button.textContent?.trim() === '2026',
    );
    expect(yearButton).toBeDefined();

    yearButton?.click();
    await settle(fixture);

    expect(fixture.componentInstance.valueChanges).toEqual([2026]);
  });
});
