import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

@Component({
  selector: 'app-checkbox-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './checkbox-api-page.component.html',
  styleUrl: './checkbox-api-page.component.css',
})
export class CheckboxApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly primitiveAttachmentCode = [
    '<input tngCheckbox [checked]="true" [indeterminate]="false" />',
    '',
  ].join('\n');

  protected readonly componentAttachmentCode = [
    '<tng-checkbox [checked]="releaseReady" (checkedChange)="releaseReady = $event">',
    '  Release checklist complete',
    '</tng-checkbox>',
    '',
  ].join('\n');

  protected readonly reactiveFormCode = [
    "import { Component } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';",
    "import { TngCheckboxComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-release-checklist',",
    '  standalone: true,',
    '  imports: [ReactiveFormsModule, TngCheckboxComponent],',
    "  templateUrl: './release-checklist.component.html',",
    '})',
    'export class ReleaseChecklistComponent {',
    '  readonly form = new FormGroup({',
    "    releaseReady: new FormControl<boolean | 'mixed'>(false, { nonNullable: true }),",
    '  });',
    '}',
    '',
    '<form [formGroup]="form">',
    '  <tng-checkbox formControlName="releaseReady">',
    '    Release checklist complete',
    '  </tng-checkbox>',
    '</form>',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
