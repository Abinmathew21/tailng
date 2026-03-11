import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';
import {
  DocsExamplePanelComponent,
  type DocsExampleCodeTab,
} from '../../../../../../shared/example-panel/docs-example-panel.component';

@Component({
  selector: 'app-toggle-examples-page',
  imports: [DocsExamplePanelComponent, TngToggleComponent, TngToggleGroupComponent],
  templateUrl: './toggle-examples-page.component.html',
  styleUrl: './toggle-examples-page.component.css',
})
export class ToggleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    this.resolveCodeBlockTheme(),
  );
  private readonly colorSchemeObserver = this.observeCodeThemeChanges();

  protected readonly bold = signal(false);
  protected readonly italic = signal(true);
  protected readonly compactMode = signal(false);
  protected readonly listMode = signal(true);
  protected readonly notificationsEnabled = signal(true);

  protected readonly summary = computed<string>(() => {
    const enabled: string[] = [];
    if (this.bold()) {
      enabled.push('bold');
    }
    if (this.italic()) {
      enabled.push('italic');
    }
    if (this.compactMode()) {
      enabled.push('compact');
    }
    if (this.listMode()) {
      enabled.push('list');
    }
    if (this.notificationsEnabled()) {
      enabled.push('notifications');
    }

    return enabled.length > 0 ? enabled.join(', ') : 'none';
  });

  protected readonly toolbarCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'toolbar-toggle-example.component.html',
      code: [
        '<tng-toggle [pressed]="bold()" (pressedChange)="bold.set($event)">',
        '  <span offIcon>B</span>',
        '  <span onIcon>B</span>',
        '</tng-toggle>',
        '<tng-toggle [pressed]="italic()" (pressedChange)="italic.set($event)">',
        '  <span offIcon>I</span>',
        '  <span onIcon>I</span>',
        '</tng-toggle>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly modeCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'view-mode-toggle-group-example.component.html',
      code: [
        '<tng-toggle-group ariaLabel="View mode toggles">',
        '  <tng-toggle [pressed]="compactMode()" (pressedChange)="compactMode.set($event)">',
        '    <span offIcon>compact</span>',
        '    <span onIcon>compact</span>',
        '  </tng-toggle>',
        '  <tng-toggle [pressed]="listMode()" (pressedChange)="listMode.set($event)">',
        '    <span offIcon>list</span>',
        '    <span onIcon>list</span>',
        '  </tng-toggle>',
        '</tng-toggle-group>',
        '',
      ].join('\n'),
    },
  ]);

  protected readonly disabledCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: 'disabled-toggle-example.component.html',
      code: [
        '<tng-toggle [pressed]="notificationsEnabled()" (pressedChange)="notificationsEnabled.set($event)">',
        '  <span offIcon>🔔</span>',
        '  <span onIcon>🔕</span>',
        '</tng-toggle>',
        '<tng-toggle [disabled]="true">Disabled</tng-toggle>',
        '',
      ].join('\n'),
    },
  ]);

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private observeCodeThemeChanges(): MutationObserver | null {
    const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
    if (mutationObserverCtor === undefined) {
      return null;
    }

    const observer = new mutationObserverCtor(() => {
      this.codeBlockTheme.set(this.resolveCodeBlockTheme());
    });

    observer.observe(this.documentRef.documentElement, {
      attributeFilter: ['style', 'class'],
      attributes: true,
    });

    return observer;
  }

  private resolveCodeBlockTheme(): 'github-dark' | 'github-light' {
    const root = this.documentRef.documentElement;
    const inlineColorScheme = root.style.getPropertyValue('color-scheme').trim().toLowerCase();
    if (inlineColorScheme.includes('dark')) {
      return 'github-dark';
    }

    const computedColorScheme = this.documentRef.defaultView
      ?.getComputedStyle(root)
      .getPropertyValue('color-scheme')
      .trim()
      .toLowerCase();

    return computedColorScheme?.includes('dark') ? 'github-dark' : 'github-light';
  }
}
