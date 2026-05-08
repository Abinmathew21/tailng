import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../../../shared/util';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-input-api-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './input-api-page.component.html',
  styleUrl: './input-api-page.component.css',
})
export class InputApiPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(this.documentRef, this.codeBlockTheme);

  protected readonly componentTemplateCode = [
    "import { Component } from '@angular/core';",
    "import { TngInputComponent } from '@tailng-ui/components';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-api-tng-input',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    '  template: `',
    '    <tng-input',
    '      type="email"',
    '      placeholder="team@tailng.dev"',
    '      ariaLabel="Email"',
    '      inputmode="email"',
    '      enterkeyhint="next"',
    '      autocomplete="email"',
    '      [maxlength]="64"',
    '      (change)="onCommit($event)"',
    '    ></tng-input>',
    '  `,',
    '})',
    'export class DocCmpInputApiTngInputComponent {',
    '  protected onCommit(event: Event): void {',
    '    // Persist on native change/commit.',
    '  }',
    '}',
    '',
  ].join('\n');

  protected readonly formFieldTemplateCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-api-form-field',",
    '  standalone: true,',
    '  imports: [TngFormFieldComponent, TngInput, TngPrefix, TngSuffix],',
    '  template: `',
    '    <tng-form-field>',
    '      <span tngPrefix aria-hidden="true">Search</span>',
    '      <input',
    '        tngInput',
    '        type="search"',
    '        placeholder="Search docs"',
    '        aria-label="Search docs"',
    '      />',
    '      <span tngSuffix aria-hidden="true">Ctrl+K</span>',
    '    </tng-form-field>',
    '  `,',
    '})',
    'export class DocCmpInputApiFormFieldComponent {}',
    '',
  ].join('\n');

  protected readonly directiveAttachCode = [
    "import { Component } from '@angular/core';",
    "import { TngInput } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-doc-cmp-input-api-primitive',",
    '  standalone: true,',
    '  imports: [TngInput],',
    '  template: `',
    '    <input',
    '      tngInput',
    '      type="text"',
    '      placeholder="Plain primitive input"',
    '      aria-label="Plain primitive input"',
    '    />',
    '  `,',
    '})',
    'export class DocCmpInputApiPrimitiveComponent {}',
    '',
  ].join('\n');

  protected readonly signalFormsCode = String.raw`import { Component, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { TngInputComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-profile-name-field',
  standalone: true,
  imports: [FormField, TngInputComponent],
  template: \`
    <tng-input
      ariaLabel="Profile name"
      placeholder="Prince"
      [formField]="profileForm.name"
    ></tng-input>
  \`,
})
export class ProfileNameFieldComponent {
  readonly profileModel = signal({ name: '' });
  readonly profileForm = form(this.profileModel);
}`;

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
