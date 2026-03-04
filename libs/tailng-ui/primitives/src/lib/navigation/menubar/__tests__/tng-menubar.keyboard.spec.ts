import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { TngMenubar, TngMenubarItem } from '../tng-menubar';

function keydown(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

@Component({
  standalone: true,
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarKeyboardHostComponent {}

@Component({
  standalone: true,
  imports: [TngMenubar, TngMenubarItem],
  template: `
    <div tngMenubar [loop]="loop()" data-testid="menubar">
      <button tngMenubarItem data-testid="item-file">File</button>
      <button tngMenubarItem data-testid="item-edit">Edit</button>
      <button tngMenubarItem data-testid="item-view">View</button>
    </div>
  `,
})
class MenubarNoWrapHostComponent {
  readonly loop = signal(false);
}

describe('tng-menubar keyboard navigation', () => {
  it('moves focus to the previous top-level item on ArrowLeft', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;

    edit.focus();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('wraps focus from the first item to the last item on ArrowLeft', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    expect(document.activeElement).toBe(file);

    keydown(file, 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(view);
  });

  it('wraps focus from the last item to the first item on ArrowRight', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    view.focus();
    expect(document.activeElement).toBe(view);

    keydown(view, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(file);
  });

  it('does not wrap at the ends when loop is disabled', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarNoWrapHostComponent],
    }).createComponent(MenubarNoWrapHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    file.focus();
    keydown(file, 'ArrowLeft');
    fixture.detectChanges();
    expect(document.activeElement).toBe(file);

    view.focus();
    keydown(view, 'ArrowRight');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);
  });

  it('moves focus to the first item on Home and the last item on End', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarKeyboardHostComponent],
    }).createComponent(MenubarKeyboardHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const edit = fixture.nativeElement.querySelector('[data-testid="item-edit"]') as HTMLButtonElement;
    const view = fixture.nativeElement.querySelector('[data-testid="item-view"]') as HTMLButtonElement;

    edit.focus();
    expect(document.activeElement).toBe(edit);

    keydown(edit, 'End');
    fixture.detectChanges();
    expect(document.activeElement).toBe(view);

    keydown(view, 'Home');
    fixture.detectChanges();
    expect(document.activeElement).toBe(file);
  });
});
