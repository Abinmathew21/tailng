import { Component } from '@angular/core';
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
    <div tngMenubar data-testid="menubar-a">
      <button tngMenubarItem data-testid="a-file">File</button>
      <button tngMenubarItem data-testid="a-edit">Edit</button>
    </div>

    <div tngMenubar data-testid="menubar-b">
      <button tngMenubarItem data-testid="b-view">View</button>
      <button tngMenubarItem data-testid="b-help">Help</button>
    </div>
  `,
})
class MenubarIsolationHostComponent {}

describe('tng-menubar isolation across multiple menubars', () => {
  it('keeps each menubar\'s roving tabindex state independent', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarIsolationHostComponent],
    }).createComponent(MenubarIsolationHostComponent);

    fixture.detectChanges();

    const aFile = fixture.nativeElement.querySelector('[data-testid="a-file"]') as HTMLButtonElement;
    const aEdit = fixture.nativeElement.querySelector('[data-testid="a-edit"]') as HTMLButtonElement;
    const bView = fixture.nativeElement.querySelector('[data-testid="b-view"]') as HTMLButtonElement;
    const bHelp = fixture.nativeElement.querySelector('[data-testid="b-help"]') as HTMLButtonElement;

    aEdit.focus();
    fixture.detectChanges();

    expect(aFile.getAttribute('tabindex')).toBe('-1');
    expect(aEdit.getAttribute('tabindex')).toBe('0');
    expect(bView.getAttribute('tabindex')).toBe('0');
    expect(bHelp.getAttribute('tabindex')).toBe('-1');

    bHelp.focus();
    fixture.detectChanges();

    expect(aFile.getAttribute('tabindex')).toBe('-1');
    expect(aEdit.getAttribute('tabindex')).toBe('0');
    expect(bView.getAttribute('tabindex')).toBe('-1');
    expect(bHelp.getAttribute('tabindex')).toBe('0');
  });

  it('does not jump focus between different menubars during arrow-key navigation', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MenubarIsolationHostComponent],
    }).createComponent(MenubarIsolationHostComponent);

    fixture.detectChanges();

    const aEdit = fixture.nativeElement.querySelector('[data-testid="a-edit"]') as HTMLButtonElement;
    const bView = fixture.nativeElement.querySelector('[data-testid="b-view"]') as HTMLButtonElement;
    const bHelp = fixture.nativeElement.querySelector('[data-testid="b-help"]') as HTMLButtonElement;

    bView.focus();
    expect(document.activeElement).toBe(bView);

    keydown(bView, 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(bHelp);
    expect(document.activeElement).not.toBe(aEdit);
  });
});
