import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-toggle-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './toggle-api-page.component.html',
  styleUrl: './toggle-api-page.component.css',
})
export class ToggleApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly primitiveBridgeCode = [
    '<button tngToggle [pressed]="isPinned()" (pressedChange)="isPinned.set($event)">',
    '  Pin sidebar',
    '</button>',
    '',
  ].join('\n');

  protected readonly componentStandaloneCode = [
    '<tng-toggle',
    '  [pressed]="isPinned()"',
    '  pressedLabel="Unpin sidebar"',
    '  unpressedLabel="Pin sidebar"',
    '  (pressedChange)="isPinned.set($event)"',
    '>',
    '  <span offIcon>P</span>',
    '  <span onIcon>P</span>',
    '</tng-toggle>',
    '',
  ].join('\n');

  protected readonly componentGroupCode = [
    '<tng-toggle-group',
    '  selectionMode="single"',
    '  ariaLabel="Editor density"',
    '  [value]="density()"',
    '  (valueChange)="onDensityChange($event)"',
    '>',
    '  <tng-toggle',
    '    [value]="\'compact\'"',
    '    pressedLabel="Compact density selected"',
    '    unpressedLabel="Select compact density"',
    '  >',
    '    <span offIcon>C</span>',
    '    <span onIcon>C</span>',
    '  </tng-toggle>',
    '  <tng-toggle',
    '    [value]="\'comfortable\'"',
    '    pressedLabel="Comfortable density selected"',
    '    unpressedLabel="Select comfortable density"',
    '  >',
    '    <span offIcon>M</span>',
    '    <span onIcon>M</span>',
    '  </tng-toggle>',
    '</tng-toggle-group>',
    '',
  ].join('\n');

  protected readonly reactiveFormsCode = [
    "readonly pinSidebarControl = new FormControl(false, { nonNullable: true });",
    '',
    '<tng-toggle formControlName="pinSidebar">',
    '  <span offIcon>P</span>',
    '  <span onIcon>P</span>',
    '</tng-toggle>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
