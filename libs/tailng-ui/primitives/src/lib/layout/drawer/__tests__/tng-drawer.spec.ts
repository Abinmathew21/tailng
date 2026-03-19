import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { TngDrawer, TngDrawerContainer, TngDrawerContent } from '../tng-drawer';

@Component({
  imports: [TngDrawerContainer, TngDrawer, TngDrawerContent],
  template: `
    <section tngDrawerContainer data-testid="container">
      <aside tngDrawer data-testid="drawer-start"></aside>
      <main tngDrawerContent data-testid="content"></main>
    </section>
  `,
})
class SingleDrawerLayoutHostComponent {}

@Component({
  imports: [TngDrawerContainer, TngDrawer, TngDrawerContent],
  template: `
    <section tngDrawerContainer data-testid="container">
      <aside tngDrawer data-testid="drawer-start"></aside>
      <aside tngDrawer position="end" data-testid="drawer-end"></aside>
      <main tngDrawerContent data-testid="content"></main>
    </section>
  `,
})
class MultiDrawerLayoutHostComponent {}

@Component({
  imports: [TngDrawer],
  template: `
    <aside tngDrawer data-testid="drawer"></aside>
  `,
})
class DrawerWithoutContainerHostComponent {}

@Component({
  imports: [TngDrawerContainer, TngDrawerContent],
  template: `
    <section tngDrawerContainer data-testid="container">
      <main tngDrawerContent data-testid="content-1"></main>
      <main tngDrawerContent data-testid="content-2"></main>
    </section>
  `,
})
class MultipleDrawerContentHostComponent {}

describe('tng-drawer primitives', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exports the drawer-container, drawer, and drawer-content primitives', () => {
    expect(typeof TngDrawerContainer).toBe('function');
    expect(typeof TngDrawer).toBe('function');
    expect(typeof TngDrawerContent).toBe('function');
  });

  it('renders a single drawer-content region linked to the container', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [SingleDrawerLayoutHostComponent],
    }).createComponent(SingleDrawerLayoutHostComponent);

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-testid="container"]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[data-testid="content"]') as HTMLElement;

    expect(container.getAttribute('data-slot')).toBe('drawer-container');
    expect(container.id).toBeTruthy();
    expect(container.getAttribute('data-content-count')).toBe('1');
    expect(container.getAttribute('data-content-conflict')).toBeNull();
    expect(content.getAttribute('data-slot')).toBe('drawer-content');
    expect(content.getAttribute('data-container-id')).toBe(container.id);
  });

  it('supports multiple drawers inside one container (start/end)', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultiDrawerLayoutHostComponent],
    }).createComponent(MultiDrawerLayoutHostComponent);

    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('[data-testid="container"]') as HTMLElement;
    const drawerStart = fixture.nativeElement.querySelector('[data-testid="drawer-start"]') as HTMLElement;
    const drawerEnd = fixture.nativeElement.querySelector('[data-testid="drawer-end"]') as HTMLElement;

    expect(drawerStart.getAttribute('data-slot')).toBe('drawer');
    expect(drawerStart.getAttribute('data-position')).toBe('start');
    expect(drawerStart.getAttribute('data-container-id')).toBe(container.id);
    expect(drawerEnd.getAttribute('data-position')).toBe('end');
    expect(drawerEnd.getAttribute('data-container-id')).toBe(container.id);
  });

  it('fails safely when drawer is used outside a container', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [DrawerWithoutContainerHostComponent],
    }).createComponent(DrawerWithoutContainerHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();

    const drawer = fixture.nativeElement.querySelector('[data-testid="drawer"]') as HTMLElement;

    expect(drawer.getAttribute('data-slot')).toBe('drawer');
    expect(drawer.getAttribute('data-container-id')).toBeNull();
    expect(drawer.getAttribute('data-container-missing')).toBe('true');
  });

  it('fails safely when multiple drawer-content elements are declared in one container', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [MultipleDrawerContentHostComponent],
    }).createComponent(MultipleDrawerContentHostComponent);

    expect(() => fixture.detectChanges()).not.toThrow();

    const container = fixture.nativeElement.querySelector('[data-testid="container"]') as HTMLElement;
    const firstContent = fixture.nativeElement.querySelector('[data-testid="content-1"]') as HTMLElement;
    const secondContent = fixture.nativeElement.querySelector('[data-testid="content-2"]') as HTMLElement;

    expect(container.getAttribute('data-content-count')).toBe('2');
    expect(container.getAttribute('data-content-conflict')).toBe('true');
    expect(firstContent.getAttribute('data-container-id')).toBe(container.id);
    expect(secondContent.getAttribute('data-container-id')).toBe(container.id);
  });
});
