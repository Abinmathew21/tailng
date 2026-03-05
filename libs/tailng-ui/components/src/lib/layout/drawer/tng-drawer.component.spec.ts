import { Component, ViewChild, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngDrawerContainer, TngDrawerContent } from '@tailng-ui/primitives';
import { afterEach, describe, expect, it } from 'vitest';
import { TngDrawerComponent } from './tng-drawer.component';

@Component({
  standalone: true,
  imports: [TngDrawerComponent, TngDrawerContainer, TngDrawerContent],
  template: `
    <section tngDrawerContainer [animate]="false">
      <tng-drawer
        #drawer="tngDrawerComponent"
        data-testid="drawer"
        ariaLabel="Main drawer"
        [opened]="opened()"
        (openedChange)="opened.set($event)"
        [backdrop]="false"
      >
        <button type="button" data-testid="inside-action">Action</button>
      </tng-drawer>

      <main tngDrawerContent data-testid="content">Content</main>
    </section>
  `,
})
class HostComponent {
  readonly opened = signal(false);

  @ViewChild('drawer', { static: true }) drawer!: TngDrawerComponent;
}

describe('tng-drawer component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('attaches primitive drawer behavior to the component host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement;
    expect(drawer).toBeTruthy();
    expect(drawer.getAttribute('data-slot')).toBe('drawer');
    expect(drawer.getAttribute('aria-label')).toBe('Main drawer');
    expect(drawer.getAttribute('data-state')).toBe('closed');
    expect(drawer.hasAttribute('hidden')).toBe(true);
  });

  it('forwards imperative open/close/toggle calls to the primitive', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const host = fixture.componentInstance;
    const drawerEl = fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement;

    host.drawer.open();
    fixture.detectChanges();
    expect(host.drawer.isOpen()).toBe(true);
    expect(drawerEl.getAttribute('data-state')).toBe('open');
    expect(drawerEl.hasAttribute('hidden')).toBe(false);

    host.drawer.toggle(false);
    fixture.detectChanges();
    expect(host.drawer.isOpen()).toBe(false);
    expect(drawerEl.getAttribute('data-state')).toBe('closed');
    expect(drawerEl.hasAttribute('hidden')).toBe(true);

    host.drawer.toggle(true);
    fixture.detectChanges();
    expect(host.drawer.isOpen()).toBe(true);

    host.drawer.close();
    fixture.detectChanges();
    expect(host.drawer.isOpen()).toBe(false);
  });
});
