import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngButtonComponent } from '../tng-button.component';

@Component({
  imports: [TngButtonComponent],
  template: `
    <tng-button data-testid="host-button" (click)="onClick()">Clear Selection</tng-button>
    <p data-testid="count">{{ clickCount }}</p>
  `,
})
class ButtonHostHarnessComponent {
  clickCount = 0;

  onClick(): void {
    this.clickCount += 1;
  }
}

function getByTestId<T extends Element>(fixture: { nativeElement: HTMLElement }, testId: string): T {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`) as T | null;
  if (element === null) {
    throw new Error(`Expected element [data-testid="${testId}"] to exist.`);
  }

  return element;
}

describe('tng-button host click interaction', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('emits host click event bindings when inner button is clicked', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [ButtonHostHarnessComponent],
    }).createComponent(ButtonHostHarnessComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const hostButton = getByTestId<HTMLElement>(fixture, 'host-button');
    const nativeButton = hostButton.querySelector('button') as HTMLButtonElement | null;
    expect(nativeButton).not.toBeNull();

    nativeButton?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clickCount).toBe(1);
    expect(getByTestId<HTMLElement>(fixture, 'count').textContent?.trim()).toBe('1');
  });
});
