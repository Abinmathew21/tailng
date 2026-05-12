import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngAutocompleteComponent,
  TngButtonToggleComponent,
  TngButtonToggleGroupComponent,
  TngCheckboxComponent,
  TngDatepickerComponent,
  TngError,
  TngFormFieldComponent,
  TngHint,
  TngInputComponent,
  TngInputFieldComponent,
  TngInputOtpComponent,
  TngLabelComponent,
  TngListboxComponent,
  TngMonthDaypickerComponent,
  TngMultiAutocompleteComponent,
  TngMultiSelectComponent,
  TngRadioComponent,
  TngSelectComponent,
  TngSliderComponent,
  TngSwitchComponent,
  TngTextareaComponent,
  TngToggleComponent,
  TngToggleGroupComponent,
  TngYearpickerComponent,
} from '@tailng-ui/components';
import {
  TngInput,
  TngInputFieldPrefix,
  TngInputFieldSuffix,
  type TngButtonToggleValue,
} from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createStandaloneExampleTsCode(
  selector: string,
  className: string,
  importLines: readonly string[],
  imports: readonly string[],
): string {
  return [
    "import { Component } from '@angular/core';",
    ...importLines,
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [' + imports.join(', ') + '],',
    "  templateUrl: './" + selector + ".component.html',",
    "  styleUrl: './" + selector + ".component.css',",
    '})',
    'export class ' + className + ' {}',
    '',
  ].join('\n');
}

const supportedControlsTwoColumnExampleCss = [
  '.doc-cmp-form-field-ex-form-grid {',
  '  display: grid;',
  '  gap: 1.25rem;',
  '  grid-template-columns: 1fr;',
  '}',
  '',
  '@media (min-width: 720px) {',
  '  .doc-cmp-form-field-ex-form-grid {',
  '    grid-template-columns: repeat(2, minmax(0, 1fr));',
  '  }',
  '}',
  '',
  '.doc-cmp-form-field-ex-form-grid > tng-form-field {',
  '  min-width: 0;',
  '}',
  '',
].join('\n');

/**
 * Inserts `labelPosition="<value>"` immediately after the `<tng-form-field`
 * tag name on every form-field opening, regardless of which other attributes
 * (e.g. `appearance="outlined"`, `controlType="text"`) are already set. Used
 * to derive the outline/above/left code-tab variants from the base HTML.
 */
function injectLabelPosition(html: string, labelPosition: string): string {
  return html.replace(/<tng-form-field(?=[\s>])/g, `<tng-form-field labelPosition="${labelPosition}"`);
}

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: baseName + '.component.ts', code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: baseName + '.component.html',
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: baseName + '.component.css',
      code: cssCode,
    },
  ]);
}

const formFieldImportLines = [
  "import { TngFormFieldComponent, TngHint, TngInputFieldComponent, TngLabelComponent } from '@tailng-ui/components';",
  "import { TngInput } from '@tailng-ui/primitives';",
] as const;

const inputGroupFieldImportLines = [
  "import { TngFormFieldComponent, TngHint, TngInputFieldComponent, TngLabelComponent } from '@tailng-ui/components';",
  "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
] as const;

const inputGroupImportLines = [
  "import { TngError, TngFormFieldComponent, TngHint, TngInputFieldComponent, TngLabelComponent } from '@tailng-ui/components';",
  "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
] as const;

const supportedControlsImportLines = [
  "import { TngAutocompleteComponent, TngButtonToggleComponent, TngButtonToggleGroupComponent, TngCheckboxComponent, TngDatepickerComponent, TngFormFieldComponent, TngHint, TngInputComponent, TngInputFieldComponent, TngInputOtpComponent, TngLabelComponent, TngListboxComponent, TngMonthDaypickerComponent, TngMultiAutocompleteComponent, TngMultiSelectComponent, TngRadioComponent, TngSelectComponent, TngSliderComponent, TngSwitchComponent, TngTextareaComponent, TngToggleComponent, TngToggleGroupComponent, TngYearpickerComponent } from '@tailng-ui/components';",
  "import { TngInput, TngInputFieldPrefix, TngInputFieldSuffix } from '@tailng-ui/primitives';",
] as const;

type FieldOption = {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
};

function createSupportedControlsTsCode(selector: string, className: string): string {
  return [
    "import { Component, signal } from '@angular/core';",
    ...supportedControlsImportLines,
    '',
    'type FieldOption = {',
    '  readonly label: string;',
    '  readonly value: string;',
    '  readonly disabled?: boolean;',
    '};',
    '',
    '@Component({',
    "  selector: '" + selector + "',",
    '  standalone: true,',
    '  imports: [',
    '    TngAutocompleteComponent,',
    '    TngButtonToggleComponent,',
    '    TngButtonToggleGroupComponent,',
    '    TngCheckboxComponent,',
    '    TngDatepickerComponent,',
    '    TngFormFieldComponent,',
    '    TngHint,',
    '    TngInputComponent,',
    '    TngInputFieldComponent,',
    '    TngInputOtpComponent,',
    '    TngLabelComponent,',
    '    TngListboxComponent,',
    '    TngMonthDaypickerComponent,',
    '    TngMultiAutocompleteComponent,',
    '    TngMultiSelectComponent,',
    '    TngRadioComponent,',
    '    TngSelectComponent,',
    '    TngSliderComponent,',
    '    TngSwitchComponent,',
    '    TngTextareaComponent,',
    '    TngToggleComponent,',
    '    TngToggleGroupComponent,',
    '    TngYearpickerComponent,',
    '    TngInput,',
    '    TngInputFieldPrefix,',
    '    TngInputFieldSuffix,',
    '  ],',
    "  templateUrl: './" + selector + ".component.html',",
    "  styleUrl: './" + selector + ".component.css',",
    '})',
    'export class ' + className + ' {',
    '  readonly docsFormFieldSupportedSwitchEmails = signal(false);',
    '  readonly docsFormFieldSupportedToggleGroupDensity = signal<string | null>(\'comfortable\');',
    '  readonly docsFormFieldSupportedButtonToggleGroupDensity = signal<string | null>(\'comfortable\');',
    '',
    "  readonly ownerOptions: readonly FieldOption[] = [",
    "    { label: 'Asha Raman', value: 'asha' },",
    "    { label: 'Mika Chen', value: 'mika' },",
    "    { label: 'Noor Patel', value: 'noor' },",
    '  ];',
    '',
    "  readonly skillOptions: readonly FieldOption[] = [",
    "    { label: 'Accessibility', value: 'a11y' },",
    "    { label: 'Design systems', value: 'design-systems' },",
    "    { label: 'Performance', value: 'performance' },",
    '  ];',
    '',
    "  readonly priorityOptions: readonly FieldOption[] = [",
    "    { label: 'Low', value: 'low' },",
    "    { label: 'Medium', value: 'medium' },",
    "    { label: 'High', value: 'high' },",
    '  ];',
    '',
    "  readonly channelOptions: readonly FieldOption[] = [",
    "    { label: 'Docs', value: 'docs' },",
    "    { label: 'Runtime', value: 'runtime' },",
    "    { label: 'Theme', value: 'theme' },",
    '  ];',
    '',
    '  readonly getOptionValue = (option: FieldOption): string => option.value;',
    '  readonly getOptionLabel = (option: FieldOption): string => option.label;',
    '}',
    '',
  ].join('\n');
}

@Component({
  selector: 'app-form-field-examples-page',
  imports: [
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
    NgTemplateOutlet,
    TngAutocompleteComponent,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
    TngCheckboxComponent,
    TngDatepickerComponent,
    TngFormFieldComponent,
    TngInputComponent,
    TngInputFieldComponent,
    TngInputOtpComponent,
    TngLabelComponent,
    TngListboxComponent,
    TngMonthDaypickerComponent,
    TngMultiAutocompleteComponent,
    TngMultiSelectComponent,
    TngRadioComponent,
    TngSelectComponent,
    TngSliderComponent,
    TngSwitchComponent,
    TngTextareaComponent,
    TngToggleComponent,
    TngToggleGroupComponent,
    TngYearpickerComponent,
    TngHint,
    TngError,
    TngInput,
    TngInputFieldPrefix,
    TngInputFieldSuffix,
  ],
  templateUrl: './form-field-examples-page.component.html',
  styleUrls: [
    '../../../input/sections/examples/input-examples-page.component.css',
    './form-field-examples-page.component.css',
  ],
})
export class FormFieldExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly ownerOptions: readonly FieldOption[] = [
    { label: 'Asha Raman', value: 'asha' },
    { label: 'Mika Chen', value: 'mika' },
    { label: 'Noor Patel', value: 'noor' },
  ];

  protected readonly skillOptions: readonly FieldOption[] = [
    { label: 'Accessibility', value: 'a11y' },
    { label: 'Design systems', value: 'design-systems' },
    { label: 'Performance', value: 'performance' },
  ];

  protected readonly priorityOptions: readonly FieldOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  protected readonly channelOptions: readonly FieldOption[] = [
    { label: 'Docs', value: 'docs' },
    { label: 'Runtime', value: 'runtime' },
    { label: 'Theme', value: 'theme' },
  ];

  protected readonly getOptionValue = (option: FieldOption): string => option.value;
  protected readonly getOptionLabel = (option: FieldOption): string => option.label;

  protected readonly docsFormFieldSupportedPlainSwitchEmails = signal(false);
  protected readonly docsFormFieldSupportedTailwindSwitchEmails = signal(false);
  protected readonly docsFormFieldSupportedLabelLayoutSwitchEmails = signal(false);
  protected readonly docsFormFieldInlinePreviewSwitchEmails = signal(false);

  protected readonly docsFormFieldSupportedPlainToggleGroupDensity = signal<string | null>('comfortable');
  protected readonly docsFormFieldSupportedTailwindToggleGroupDensity = signal<string | null>('comfortable');
  protected readonly docsFormFieldSupportedLabelLayoutToggleGroupDensity = signal<string | null>('comfortable');

  protected readonly docsFormFieldSupportedPlainButtonToggleGroupDensity = signal<TngButtonToggleValue | null>(
    'comfortable',
  );
  protected readonly docsFormFieldSupportedTailwindButtonToggleGroupDensity = signal<TngButtonToggleValue | null>(
    'comfortable',
  );
  protected readonly docsFormFieldSupportedLabelLayoutButtonToggleGroupDensity = signal<TngButtonToggleValue | null>(
    'comfortable',
  );

  private readonly supportedControlsPlainHtmlCode = [
    '<div class="doc-cmp-form-field-ex-form-grid">',
    '  <tng-form-field>',
    '    <tng-label forId="project-name">Input component</tng-label>',
    '    <tng-input id="project-name" name="projectName" placeholder="Migration plan" />',
    '    <p tngHint>Use the styled input component for simple text values.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label forId="workspace-handle">Input field shell</tng-label>',
    '    <tng-input-field>',
    '      <span tngInputFieldPrefix>@</span>',
    '      <input tngInput id="workspace-handle" name="workspaceHandle" placeholder="acme" />',
    '      <span tngInputFieldSuffix>.team</span>',
    '    </tng-input-field>',
    '    <p tngHint>Use the input-field shell when the input needs inner adornments.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label forId="release-summary">Textarea</tng-label>',
    '    <tng-textarea id="release-summary" name="summary" placeholder="Summarize the release" />',
    '    <p tngHint>Textarea keeps multiline entry in the same field contract.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label>Autocomplete</tng-label>',
    '    <tng-autocomplete',
    '      [options]="ownerOptions"',
    '      [getOptionValue]="getOptionValue"',
    '      [getOptionLabel]="getOptionLabel"',
    '      placeholder="Search owner"',
    '      ariaLabel="Release owner"',
    '    />',
    '    <p tngHint>Autocomplete works as one searchable control surface.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label>MultiAutocomplete</tng-label>',
    '    <tng-multi-autocomplete',
    '      [options]="skillOptions"',
    '      [getOptionValue]="getOptionValue"',
    '      [getOptionLabel]="getOptionLabel"',
    '      placeholder="Add skills"',
    '      ariaLabel="Required skills"',
    '    />',
    '    <p tngHint>MultiAutocomplete collects several searchable values.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label id="priority-label">Select</tng-label>',
    '    <tng-select',
    '      [options]="priorityOptions"',
    '      [getOptionValue]="getOptionValue"',
    '      [getOptionLabel]="getOptionLabel"',
    '      placeholder="Choose priority"',
    '      labelId="priority-label"',
    '    />',
    '    <p tngHint>Select uses the field shell for label and message rhythm.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label id="channel-label">MultiSelect</tng-label>',
    '    <tng-multiselect',
    '      [options]="channelOptions"',
    "      [value]=\"['docs', 'runtime']\"",
    '      [getOptionValue]="getOptionValue"',
    '      [getOptionLabel]="getOptionLabel"',
    '      placeholder="Choose channels"',
    '      labelId="channel-label"',
    '    />',
    '    <p tngHint>MultiSelect keeps a multi-value trigger in one field.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field>',
    '    <tng-label forId="release-date">Datepicker</tng-label>',
    '    <tng-datepicker',
    '      id="release-date"',
    "      [defaultValue]=\"'2026-05-18'\"",
    "      [today]=\"'2026-05-09'\"",
    '      placeholder="Pick release date"',
    '      ariaLabel="Release date"',
    '    />',
    '    <p tngHint>Datepicker remains a single date field with calendar affordances.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined" controlType="text">',
    '    <tng-label>Switch</tng-label>',
    '    <tng-switch',
    '      ariaLabel="Email notifications"',
    '      [checked]="docsFormFieldSupportedSwitchEmails()"',
    '      (checkedChange)="docsFormFieldSupportedSwitchEmails.set($event)"',
    '    />',
    '    <p tngHint>Switch with a forced outlined frame and stacked label.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined" controlType="text">',
    '    <tng-label>Toggle</tng-label>',
    '    <tng-toggle pressedLabel="On" unpressedLabel="Off" />',
    '    <p tngHint>Toggle with a forced outlined frame and stacked label.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined" controlType="text">',
    '    <tng-label>Radio</tng-label>',
    '    <tng-radio name="plan" value="pro">Pro</tng-radio>',
    '    <p tngHint>Radio with a forced outlined frame and stacked label.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label>Slider</tng-label>',
    '    <tng-slider [min]="0" [max]="100" [value]="60" />',
    '    <p tngHint>Slider drawn inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label>Input OTP</tng-label>',
    '    <tng-input-otp [length]="6" />',
    '    <p tngHint>Input OTP drawn inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label>Toggle group</tng-label>',
    '    <tng-toggle-group',
    '      selectionMode="single"',
    '      ariaLabel="Editor density"',
    '      [value]="docsFormFieldSupportedToggleGroupDensity()"',
    '      (valueChange)="docsFormFieldSupportedToggleGroupDensity.set($event)"',
    '    >',
    "      <tng-toggle [value]=\"'compact'\" pressedLabel=\"Compact density\" unpressedLabel=\"Compact density\">",
    '        Compact',
    '      </tng-toggle>',
    "      <tng-toggle [value]=\"'comfortable'\" pressedLabel=\"Comfortable density\" unpressedLabel=\"Comfortable density\">",
    '        Comfortable',
    '      </tng-toggle>',
    "      <tng-toggle [value]=\"'spacious'\" pressedLabel=\"Spacious density\" unpressedLabel=\"Spacious density\">",
    '        Spacious',
    '      </tng-toggle>',
    '    </tng-toggle-group>',
    '    <p tngHint>Toggle group inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label>Button toggle group</tng-label>',
    '    <tng-button-toggle-group',
    '      ariaLabel="Density"',
    '      [value]="docsFormFieldSupportedButtonToggleGroupDensity()"',
    '      (valueChange)="docsFormFieldSupportedButtonToggleGroupDensity.set($event)"',
    '    >',
    "      <tng-button-toggle [tngButtonToggleValue]=\"'compact'\">Compact</tng-button-toggle>",
    "      <tng-button-toggle [tngButtonToggleValue]=\"'comfortable'\">Comfortable</tng-button-toggle>",
    "      <tng-button-toggle [tngButtonToggleValue]=\"'spacious'\">Spacious</tng-button-toggle>",
    '    </tng-button-toggle-group>',
    '    <p tngHint>Button toggle group inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined" controlType="text">',
    '    <tng-label>Checkbox</tng-label>',
    '    <tng-checkbox name="notifications">Send weekly digest</tng-checkbox>',
    '    <p tngHint>Checkbox with a forced outlined frame and stacked label.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label>Listbox</tng-label>',
    '    <tng-listbox',
    '      [options]="channelOptions"',
    '      [getOptionValue]="getOptionValue"',
    '      [getOptionLabel]="getOptionLabel"',
    '      ariaLabel="Release channels"',
    '    />',
    '    <p tngHint>Listbox inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label forId="release-month-day">Month/Day picker</tng-label>',
    '    <tng-month-daypicker',
    '      id="release-month-day"',
    '      [defaultValue]="{ month: 5, day: 18 }"',
    '      placeholder="Pick a month and day"',
    '    />',
    '    <p tngHint>Month/Day picker inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '',
    '  <tng-form-field appearance="outlined">',
    '    <tng-label forId="release-year">Year picker</tng-label>',
    '    <tng-yearpicker',
    '      id="release-year"',
    '      [defaultValue]="2026"',
    '      placeholder="Pick release year"',
    '    />',
    '    <p tngHint>Year picker inside an explicitly outlined frame.</p>',
    '  </tng-form-field>',
    '</div>',
    '',
  ].join('\n');

  private readonly supportedControlsTailwindHtmlCode = this.supportedControlsPlainHtmlCode;

  protected readonly supportedControlsPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-supported-controls-plain',
    createSupportedControlsTsCode(
      'app-doc-cmp-form-field-ex-supported-controls-plain',
      'DocCmpFormFieldExSupportedControlsPlainComponent',
    ),
    this.supportedControlsPlainHtmlCode,
    supportedControlsTwoColumnExampleCss,
  );

  protected readonly supportedControlsTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-supported-controls-tailwind',
    createSupportedControlsTsCode(
      'app-doc-cmp-form-field-ex-supported-controls-tailwind',
      'DocCmpFormFieldExSupportedControlsTailwindComponent',
    ),
    this.supportedControlsTailwindHtmlCode,
    supportedControlsTwoColumnExampleCss,
  );

  protected readonly supportedControlsOutlineCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-supported-controls-outline',
    createSupportedControlsTsCode(
      'app-doc-cmp-form-field-ex-supported-controls-outline',
      'DocCmpFormFieldExSupportedControlsOutlineComponent',
    ),
    injectLabelPosition(this.supportedControlsPlainHtmlCode, 'outline'),
    supportedControlsTwoColumnExampleCss,
  );

  protected readonly supportedControlsAboveCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-supported-controls-above',
    createSupportedControlsTsCode(
      'app-doc-cmp-form-field-ex-supported-controls-above',
      'DocCmpFormFieldExSupportedControlsAboveComponent',
    ),
    injectLabelPosition(this.supportedControlsPlainHtmlCode, 'above'),
    supportedControlsTwoColumnExampleCss,
  );

  protected readonly supportedControlsLeftCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-supported-controls-left',
    createSupportedControlsTsCode(
      'app-doc-cmp-form-field-ex-supported-controls-left',
      'DocCmpFormFieldExSupportedControlsLeftComponent',
    ),
    injectLabelPosition(
      this.supportedControlsPlainHtmlCode.replace(
        '<div class="doc-cmp-form-field-ex-form-grid">',
        '<div>',
      ),
      'left',
    ),
    '',
  );

  protected readonly formUsagePlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-form-usage-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-form-usage-plain',
      'DocCmpFormFieldExFormUsagePlainComponent',
      inputGroupFieldImportLines,
      [
        'TngFormFieldComponent',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngHint',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<form>',
      '  <tng-form-field>',
      '    <tng-label forId="workspace-url">Workspace URL</tng-label>',
      '    <tng-input-field>',
      '      <span tngInputFieldPrefix>tailng.dev/</span>',
      '      <input tngInput id="workspace-url" name="workspaceUrl" placeholder="acme-product" />',
      '      <button tngInputFieldSuffix type="submit">Create</button>',
      '    </tng-input-field>',
      '    <p tngHint>Use lowercase letters, numbers, and hyphens.</p>',
      '  </tng-form-field>',
      '</form>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly formUsageTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-form-usage-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-form-usage-tailwind',
      'DocCmpFormFieldExFormUsageTailwindComponent',
      inputGroupFieldImportLines,
      [
        'TngFormFieldComponent',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngHint',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<form>',
      '  <tng-form-field>',
      '    <tng-label forId="workspace-url">Workspace URL</tng-label>',
      '    <tng-input-field>',
      '      <span tngInputFieldPrefix>tailng.dev/</span>',
      '      <input tngInput id="workspace-url" name="workspaceUrl" placeholder="acme-product" />',
      '      <button tngInputFieldSuffix type="submit">Create</button>',
      '    </tng-input-field>',
      '    <p tngHint>Use lowercase letters, numbers, and hyphens.</p>',
      '  </tng-form-field>',
      '</form>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly basicPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-basic-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-basic-plain',
      'DocCmpFormFieldExBasicPlainComponent',
      formFieldImportLines,
      ['TngFormFieldComponent', 'TngHint', 'TngInputFieldComponent', 'TngLabelComponent', 'TngInput'],
    ),
    [
      '<tng-form-field>',
      '  <tng-label forId="workspace-name">Workspace name</tng-label>',
      '  <tng-input-field>',
      '    <input tngInput id="workspace-name" name="workspace" placeholder="Acme product" />',
      '  </tng-input-field>',
      '  <p tngHint>Use a name your team will recognize.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly basicTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-basic-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-basic-tailwind',
      'DocCmpFormFieldExBasicTailwindComponent',
      formFieldImportLines,
      ['TngFormFieldComponent', 'TngHint', 'TngInputFieldComponent', 'TngLabelComponent', 'TngInput'],
    ),
    [
      '<tng-form-field>',
      '  <tng-label forId="workspace-name">Workspace name</tng-label>',
      '  <tng-input-field>',
      '    <input tngInput id="workspace-name" name="workspace" placeholder="Acme product" />',
      '  </tng-input-field>',
      '  <p tngHint>Use a name your team will recognize.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly leftPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-left-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-left-plain',
      'DocCmpFormFieldExLeftPlainComponent',
      formFieldImportLines,
      ['TngFormFieldComponent', 'TngHint', 'TngInputFieldComponent', 'TngLabelComponent', 'TngInput'],
    ),
    [
      '<tng-form-field labelPosition="left">',
      '  <tng-label forId="workspace-slug">Workspace slug</tng-label>',
      '  <tng-input-field>',
      '    <input tngInput id="workspace-slug" name="slug" placeholder="acme-platform" />',
      '  </tng-input-field>',
      '  <p tngHint>Lowercase letters and hyphens only.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly leftTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-left-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-left-tailwind',
      'DocCmpFormFieldExLeftTailwindComponent',
      formFieldImportLines,
      ['TngFormFieldComponent', 'TngHint', 'TngInputFieldComponent', 'TngLabelComponent', 'TngInput'],
    ),
    [
      '<tng-form-field labelPosition="left">',
      '  <tng-label forId="workspace-slug">Workspace slug</tng-label>',
      '  <tng-input-field>',
      '    <input tngInput id="workspace-slug" name="slug" placeholder="acme-platform" />',
      '  </tng-input-field>',
      '  <p tngHint>Lowercase letters and hyphens only.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly errorPlainCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-error-plain',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-error-plain',
      'DocCmpFormFieldExErrorPlainComponent',
      inputGroupImportLines,
      [
        'TngError',
        'TngFormFieldComponent',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngHint',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<tng-form-field hideHintWhenError invalid>',
      '  <tng-label forId="budget">Budget</tng-label>',
      '  <tng-input-field tone="danger">',
      '    <span tngInputFieldPrefix>$</span>',
      '    <input tngInput id="budget" name="budget" type="number" />',
      '    <button tngInputFieldSuffix type="button">Clear</button>',
      '  </tng-input-field>',
      '  <p tngHint>Whole dollars only.</p>',
      '  <p tngError>Budget is required.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  protected readonly errorTailwindCodeTabs = createCodeTabs(
    'doc-cmp-form-field-examples-error-tailwind',
    createStandaloneExampleTsCode(
      'app-doc-cmp-form-field-ex-error-tailwind',
      'DocCmpFormFieldExErrorTailwindComponent',
      inputGroupImportLines,
      [
        'TngError',
        'TngFormFieldComponent',
        'TngInputFieldComponent',
        'TngLabelComponent',
        'TngHint',
        'TngInput',
        'TngInputFieldPrefix',
        'TngInputFieldSuffix',
      ],
    ),
    [
      '<tng-form-field hideHintWhenError invalid>',
      '  <tng-label forId="budget">Budget</tng-label>',
      '  <tng-input-field tone="danger">',
      '    <span tngInputFieldPrefix>$</span>',
      '    <input tngInput id="budget" name="budget" type="number" />',
      '    <button tngInputFieldSuffix type="button">Clear</button>',
      '  </tng-input-field>',
      '  <p tngHint>Whole dollars only.</p>',
      '  <p tngError>Budget is required.</p>',
      '</tng-form-field>',
      '',
    ].join('\n'),
    '',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
