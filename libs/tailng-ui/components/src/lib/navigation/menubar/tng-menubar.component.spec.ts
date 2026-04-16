import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { TngMenubarComponent } from './tng-menubar.component';
import { TngMenuGroupLabel, TngMenubarItem, TngMenuItem, TngMenuSeparator } from '@tailng-ui/primitives';
import { TngMenuComponent } from '../menu/tng-menu.component';

@Component({
  imports: [TngMenubarComponent, TngMenubarItem],
  template: `
    <tng-menubar ariaLabel="Workspace actions" data-testid="menubar">
      <button type="button" tngMenubarItem>File</button>
      <button type="button" tngMenubarItem>Edit</button>
    </tng-menubar>
  `,
})
class HostComponent {}

function keydown(el: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
  });

  el.dispatchEvent(event);
  return event;
}

function flushMicrotask(): Promise<void> {
  return Promise.resolve();
}

/** `TngMenuComponent` repositions in rAF then syncs focus in a microtask — flush both before asserting `document.activeElement`. */
async function flushMenubarOverlayLayout(): Promise<void> {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await flushMicrotask();
}

@Component({
  imports: [TngMenubarComponent, TngMenubarItem, TngMenuComponent, TngMenuItem],
  template: `
    <tng-menubar ariaLabel="Wrapper commands" data-testid="menubar">
      <div class="shell">
        <tng-menu #fileMenu="tngMenu" ariaLabel="File menu" data-testid="file-menu">
          <button
            type="button"
            tngMenuItem
            [tngMenuItemSubmenu]="importMenu"
            data-testid="item-import"
          >
            Import from...
          </button>

          <tng-menu #importMenu="tngMenu" ariaLabel="Import menu" data-testid="import-menu">
            <button type="button" tngMenuItem data-testid="import-csv">CSV</button>
            <button
              type="button"
              tngMenuItem
              [tngMenuItemSubmenu]="gitMenu"
              data-testid="import-git"
            >
              Git repository
            </button>
          </tng-menu>

          <tng-menu #gitMenu="tngMenu" ariaLabel="Git menu" data-testid="git-menu">
            <button type="button" tngMenuItem data-testid="git-github">GitHub</button>
            <button type="button" tngMenuItem data-testid="git-gitlab">GitLab</button>
          </tng-menu>
        </tng-menu>

        <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu" data-testid="item-file">File</button>
      </div>

      <button type="button" tngMenubarItem data-testid="item-help">Help</button>
    </tng-menubar>
  `,
})
class CascadedWrapperHostComponent {}

@Component({
  imports: [
    TngMenubarComponent,
    TngMenubarItem,
    TngMenuComponent,
    TngMenuItem,
    TngMenuGroupLabel,
    TngMenuSeparator,
  ],
  template: `
    <tng-menubar ariaLabel="Wrapper cascaded commands">
      <div class="menubar-item-shell">
        <tng-menu #fileMenu="tngMenu" ariaLabel="Wrapper cascaded file menu" data-testid="file-menu">
          <div tngMenuGroupLabel>File</div>
          <button type="button" tngMenuItem data-testid="file-create">Create project</button>
          <button
            type="button"
            tngMenuItem
            [tngMenuItemSubmenu]="importMenu"
            data-testid="file-import"
          >
            Import from...
          </button>
          <div tngMenuSeparator></div>
          <button type="button" tngMenuItem data-testid="file-archive">Archive project</button>

          <tng-menu #importMenu="tngMenu" ariaLabel="Wrapper import source menu" data-testid="import-menu">
            <button type="button" tngMenuItem data-testid="import-csv">CSV file</button>
            <button
              type="button"
              tngMenuItem
              [tngMenuItemSubmenu]="gitMenu"
              data-testid="import-git"
            >
              Git repository
            </button>
          </tng-menu>

          <tng-menu #gitMenu="tngMenu" ariaLabel="Wrapper git provider menu" data-testid="git-menu">
            <button type="button" tngMenuItem data-testid="git-github">GitHub</button>
            <button type="button" tngMenuItem data-testid="git-gitlab">GitLab</button>
          </tng-menu>
        </tng-menu>

        <button type="button" tngMenubarItem [tngMenubarMenu]="fileMenu" data-testid="item-file">File</button>
      </div>

      <button type="button" tngMenubarItem data-testid="item-help">Help</button>
    </tng-menubar>
  `,
})
class CascadedWrapperDemoLikeHostComponent {}

describe('tng-menubar component', () => {
  it('attaches the primitive menubar directive to host and wires aria-label', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [HostComponent],
    }).createComponent(HostComponent);

    fixture.detectChanges();

    const menubar = fixture.nativeElement.querySelector('[data-testid="menubar"]') as HTMLElement;
    expect(menubar).toBeTruthy();
    expect(menubar.getAttribute('data-slot')).toBe('menubar');
    expect(menubar.getAttribute('role')).toBe('menubar');
    expect(menubar.getAttribute('aria-label')).toBe('Workspace actions');
  });

  it('keeps second-level wrapper submenu open and active when ArrowDown is pressed inside it', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;
    const importTrigger = fixture.nativeElement.querySelector('[data-testid="item-import"]') as HTMLButtonElement;
    const importCsv = fixture.nativeElement.querySelector('[data-testid="import-csv"]') as HTMLButtonElement;
    const importGitTrigger = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;
    const gitGithub = fixture.nativeElement.querySelector('[data-testid="git-github"]') as HTMLButtonElement;
    const gitGitlab = fixture.nativeElement.querySelector('[data-testid="git-gitlab"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(importTrigger.id);
    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importCsv.id);

    keydown(importMenu, 'ArrowDown');
    fixture.detectChanges();
    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importGitTrigger.id);

    keydown(importMenu, 'ArrowRight');
    fixture.detectChanges();
    await flushMenubarOverlayLayout();

    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(gitMenu.getAttribute('aria-activedescendant')).toBe(gitGithub.id);
    expect(document.activeElement).toBe(gitMenu);

    const parentActiveBefore = fileMenu.getAttribute('aria-activedescendant');
    const level1ActiveBefore = importMenu.getAttribute('aria-activedescendant');

    keydown(gitMenu, 'ArrowDown');
    fixture.detectChanges();

    expect(gitMenu.getAttribute('aria-activedescendant')).toBe(gitGitlab.id);
    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(parentActiveBefore);
    expect(importMenu.getAttribute('aria-activedescendant')).toBe(level1ActiveBefore);
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
  });

  it('keeps first submenu level open and active when ArrowDown is pressed inside it', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const importTrigger = fixture.nativeElement.querySelector('[data-testid="item-import"]') as HTMLButtonElement;
    const importCsv = fixture.nativeElement.querySelector('[data-testid="import-csv"]') as HTMLButtonElement;
    const importGitTrigger = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(importTrigger.id);
    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importCsv.id);
    expect(importMenu.getAttribute('data-state')).toBe('open');

    const parentActiveBefore = fileMenu.getAttribute('aria-activedescendant');
    keydown(importMenu, 'ArrowDown');
    fixture.detectChanges();

    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importGitTrigger.id);
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(parentActiveBefore);
    expect(fileMenu.getAttribute('data-state')).toBe('open');
  });

  it('keeps submenu chain open on ArrowDown in level-2 for demo-like wrapper markup', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperDemoLikeHostComponent],
    }).createComponent(CascadedWrapperDemoLikeHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const fileImportTrigger = fixture.nativeElement.querySelector('[data-testid="file-import"]') as HTMLButtonElement;
    const importCsv = fixture.nativeElement.querySelector('[data-testid="import-csv"]') as HTMLButtonElement;
    const importGit = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();
    await flushMenubarOverlayLayout();

    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(fileImportTrigger.id);
    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importCsv.id);
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(importMenu);

    const rootActiveBefore = fileMenu.getAttribute('aria-activedescendant');
    keydown(importMenu, 'ArrowDown');
    fixture.detectChanges();

    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importGit.id);
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(fileMenu.getAttribute('aria-activedescendant')).toBe(rootActiveBefore);
    expect(fileMenu.getAttribute('data-state')).toBe('open');
  });

  it('keeps keyboard focus in level-2 submenu after microtasks and handles ArrowDown there', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;
    const importGitTrigger = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;
    const gitGithub = fixture.nativeElement.querySelector('[data-testid="git-github"]') as HTMLButtonElement;
    const gitGitlab = fixture.nativeElement.querySelector('[data-testid="git-gitlab"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    keydown(importMenu, 'ArrowDown');
    keydown(importMenu, 'ArrowRight');
    fixture.detectChanges();
    await flushMenubarOverlayLayout();

    expect(importMenu.getAttribute('aria-activedescendant')).toBe(importGitTrigger.id);
    expect(gitMenu.getAttribute('aria-activedescendant')).toBe(gitGithub.id);
    expect(document.activeElement).toBe(gitMenu);

    await flushMicrotask();
    fixture.detectChanges();

    expect(document.activeElement).toBe(gitMenu);
    const event = keydown(document.activeElement as HTMLElement, 'ArrowDown');
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(gitMenu.getAttribute('aria-activedescendant')).toBe(gitGitlab.id);
    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(importMenu.getAttribute('data-state')).toBe('open');
    expect(fileMenu.getAttribute('data-state')).toBe('open');
  });

  it('restores focus to deepest open submenu when focus slips to a parent open panel', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;
    const gitGitlab = fixture.nativeElement.querySelector('[data-testid="git-gitlab"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    keydown(importMenu, 'ArrowDown');
    keydown(importMenu, 'ArrowRight');
    fixture.detectChanges();
    await flushMenubarOverlayLayout();

    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(gitMenu);

    importMenu.focus();
    fixture.detectChanges();
    expect(document.activeElement).toBe(importMenu);

    await flushMicrotask();
    fixture.detectChanges();

    expect(document.activeElement).toBe(gitMenu);
    keydown(document.activeElement as HTMLElement, 'ArrowDown');
    fixture.detectChanges();

    expect(gitMenu.getAttribute('aria-activedescendant')).toBe(gitGitlab.id);
    expect(gitMenu.getAttribute('data-state')).toBe('open');
  });

  it('does not churn focus indefinitely when deepest submenu temporarily cannot own focus', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;

    file.click();
    fixture.detectChanges();

    keydown(fileMenu, 'ArrowDown');
    keydown(fileMenu, 'ArrowRight');
    fixture.detectChanges();

    keydown(importMenu, 'ArrowDown');
    keydown(importMenu, 'ArrowRight');
    fixture.detectChanges();

    const focusSpy = vi.spyOn(gitMenu, 'focus');

    for (let index = 0; index < 20; index += 1) {
      importMenu.focus();
      fixture.detectChanges();
      await flushMicrotask();
      fixture.detectChanges();
    }

    expect(gitMenu.getAttribute('data-state')).toBe('open');
    expect(focusSpy.mock.calls.length).toBeLessThanOrEqual(8);
  });

  it('closes all overlay levels when a third-level item is selected by click', async () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CascadedWrapperHostComponent],
    }).createComponent(CascadedWrapperHostComponent);

    fixture.detectChanges();

    const file = fixture.nativeElement.querySelector('[data-testid="item-file"]') as HTMLButtonElement;
    const fileMenu = fixture.nativeElement.querySelector('[data-testid="file-menu"]') as HTMLElement;
    const importMenu = fixture.nativeElement.querySelector('[data-testid="import-menu"]') as HTMLElement;
    const gitMenu = fixture.nativeElement.querySelector('[data-testid="git-menu"]') as HTMLElement;
    const importTrigger = fixture.nativeElement.querySelector('[data-testid="item-import"]') as HTMLButtonElement;
    const importGitTrigger = fixture.nativeElement.querySelector('[data-testid="import-git"]') as HTMLButtonElement;
    const gitGithub = fixture.nativeElement.querySelector('[data-testid="git-github"]') as HTMLButtonElement;

    file.click();
    fixture.detectChanges();

    importTrigger.click();
    fixture.detectChanges();
    expect(importMenu.getAttribute('data-state')).toBe('open');

    importGitTrigger.click();
    fixture.detectChanges();
    expect(gitMenu.getAttribute('data-state')).toBe('open');

    gitGithub.click();
    fixture.detectChanges();
    await flushMicrotask();
    fixture.detectChanges();

    expect(gitMenu.getAttribute('data-state')).toBe('closed');
    expect(importMenu.getAttribute('data-state')).toBe('closed');
    expect(fileMenu.getAttribute('data-state')).toBe('closed');
    expect(file.getAttribute('aria-expanded')).toBe('false');
  });
});
