import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { describe, expect, it } from 'vitest';
import { TngTabsComponent } from './tng-tabs.component';

@Component({
  standalone: true,
  imports: [TngTabsComponent, TngTabList, TngTab, TngTabPanel],
  template: `
    <tng-tabs ariaLabel="Project tabs" data-testid="tabs">
      <div tngTabList data-testid="tab-list">
        <button type="button" tngTab value="overview">Overview</button>
        <button type="button" tngTab value="api">API</button>
      </div>
      <section tngTabPanel value="overview" data-testid="panel-overview">Overview panel</section>
      <section tngTabPanel value="api" data-testid="panel-api">API panel</section>
    </tng-tabs>
  `,
})
class HostComponent {}

describe('tng-tabs component', () => {
  it('attaches primitive tabs directive to host for projected tab directives', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const tabs = fixture.nativeElement.querySelector('[data-testid="tabs"]') as HTMLElement;
    const tabList = fixture.nativeElement.querySelector('[data-testid="tab-list"]') as HTMLElement;
    const panelOverview = fixture.nativeElement.querySelector(
      '[data-testid="panel-overview"]',
    ) as HTMLElement;
    const panelApi = fixture.nativeElement.querySelector('[data-testid="panel-api"]') as HTMLElement;

    expect(tabs).toBeTruthy();
    expect(tabs.getAttribute('data-slot')).toBe('tabs');
    expect(tabs.getAttribute('aria-label')).toBe('Project tabs');
    expect(tabList.getAttribute('role')).toBe('tablist');
    expect(panelOverview.hasAttribute('hidden')).toBe(false);
    expect(panelApi.hasAttribute('hidden')).toBe(true);
  });
});
