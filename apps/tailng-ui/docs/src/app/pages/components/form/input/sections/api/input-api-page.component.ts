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
    "  selector: 'app-simple-input-demo',",
    '  standalone: true,',
    '  imports: [TngInputComponent],',
    '  template: `',
    '    <tng-input',
    '      type="email"',
    '      placeholder="team@tailng.dev"',
    '      ariaLabel="Email"',
    '    ></tng-input>',
    '  `,',
    '})',
    'export class SimpleInputDemoComponent {}',
    '',
  ].join('\n');

  protected readonly formFieldTemplateCode = [
    "import { Component } from '@angular/core';",
    "import { TngFormFieldComponent } from '@tailng-ui/components';",
    "import { TngInput, TngPrefix, TngSuffix } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-search-form-field-demo',",
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
    'export class SearchFormFieldDemoComponent {}',
    '',
  ].join('\n');

  protected readonly directiveAttachCode = [
    "import { Component } from '@angular/core';",
    "import { TngInput } from '@tailng-ui/primitives';",
    '',
    '@Component({',
    "  selector: 'app-primitive-input-demo',",
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
    'export class PrimitiveInputDemoComponent {}',
    '',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

}
