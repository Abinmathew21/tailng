import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngToggleComponent, TngToggleGroupComponent } from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  DocsExamplePanelComponent,
  type DocsExampleCodeTab,
} from '../../../../../../shared/example-panel/docs-example-panel.component';

@Component({
  selector: 'app-toggle-examples-page',
  imports: [DocsExamplePanelComponent, TngToggleComponent, TngToggleGroupComponent, TngIcon],
  templateUrl: './toggle-examples-page.component.html',
  styleUrl: './toggle-examples-page.component.css',
})
export class ToggleExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

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
        '<tng-toggle-group ariaLabel="View mode toggles" class="toggle-example-group">',
        '  <tng-toggle',
        '    [pressed]="compactMode()"',
        '    pressedLabel="Disable compact view"',
        '    unpressedLabel="Enable compact view"',
        '    (pressedChange)="compactMode.set($event)"',
        '  >',
        '    <tng-icon icon="grid" offIcon class="h-4 w-4"></tng-icon>',
        '    <tng-icon icon="grid" onIcon class="h-4 w-4"></tng-icon>',
        '  </tng-toggle>',
        '  <tng-toggle',
        '    [pressed]="listMode()"',
        '    pressedLabel="Disable list view"',
        '    unpressedLabel="Enable list view"',
        '    (pressedChange)="listMode.set($event)"',
        '  >',
        '    <tng-icon icon="list" offIcon class="h-4 w-4"></tng-icon>',
        '    <tng-icon icon="list" onIcon class="h-4 w-4"></tng-icon>',
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

}
