import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngAutocompleteComponent, TngCodeBlockComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../autocomplete.util';

interface ContractRow {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
}

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

const PORTAL_GUIDANCE_CODE = String.raw`/* Component-scoped CSS reaches the wrapper host and trigger shell. */
tng-autocomplete.release-owner-shell {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-border-strong: #cbd5e1;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
}

/* Overlay rows are portaled. Put overlay-specific selectors in a global stylesheet. */
[data-slot='autocomplete-overlay'] {
  border-radius: 1rem;
}

[data-slot='autocomplete-option'][data-selected] {
  background: color-mix(in srgb, var(--tng-semantic-accent-brand, #2563eb) 18%, transparent);
}
`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-styling-plain',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-styling-plain.component.html',
  styleUrl: './docs-autocomplete-styling-plain.component.css',
})
export class DocsAutocompleteStylingPlainComponent {
  readonly releaseOwners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('mina');
  readonly selectedSummary = computed(
    () => this.releaseOwners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-autocomplete-styling-example">
  <div class="docs-autocomplete-styling-example__header">
    <span class="docs-autocomplete-styling-example__eyebrow">Release owner</span>
    <p class="docs-autocomplete-styling-example__copy">
      Host-level token overrides restyle the wrapper without reaching into private child selectors.
    </p>
  </div>

  <tng-autocomplete
    class="docs-autocomplete-styling-example__control"
    [options]="releaseOwners"
    [value]="selectedOwner()"
    (valueChange)="onSelectedOwnerChange($event)"
    [getOptionValue]="getOwnerValue"
    [getOptionLabel]="getOwnerLabel"
    [isOptionDisabled]="isOwnerDisabled"
    placeholder="Assign a release owner"
    [ariaLabel]="'Release owner'"
  ></tng-autocomplete>

  <p class="docs-autocomplete-styling-example__summary">
    Selected: {{ selectedSummary() }}
  </p>
</section>
`;

const PLAIN_CSS_CODE = String.raw`.docs-autocomplete-styling-example {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 34rem);
  margin-inline: auto;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.1rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
}

.docs-autocomplete-styling-example__header {
  display: grid;
  gap: 0.35rem;
}

.docs-autocomplete-styling-example__eyebrow {
  font-size: 0.78rem;
  font-weight: 700;
  color: #64748b;
}

.docs-autocomplete-styling-example__copy,
.docs-autocomplete-styling-example__summary {
  margin: 0;
  color: #475569;
}

.docs-autocomplete-styling-example__control {
  display: block;
  width: 100%;
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #cbd5e1;
  --tng-semantic-border-strong: #cbd5e1;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-focus-ring: #2563eb;
}
`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngAutocompleteComponent } from '@tailng-ui/components';

interface OwnerOption {
  readonly id: string;
  readonly name: string;
  readonly disabled?: boolean;
}

const OWNER_OPTIONS: readonly OwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen' },
  { id: 'mina', name: 'Mina Lee' },
  { id: 'omar', name: 'Omar Aziz', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel' },
]);

@Component({
  selector: 'app-docs-autocomplete-styling-tailwind',
  standalone: true,
  imports: [TngAutocompleteComponent],
  templateUrl: './docs-autocomplete-styling-tailwind.component.html',
  styleUrl: './docs-autocomplete-styling-tailwind.component.css',
})
export class DocsAutocompleteStylingTailwindComponent {
  readonly releaseOwners = OWNER_OPTIONS;
  readonly selectedOwner = signal<string | null>('abigail');
  readonly selectedSummary = computed(
    () => this.releaseOwners.find((owner) => owner.id === this.selectedOwner())?.name ?? 'none',
  );
  readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;

  onSelectedOwnerChange(value: unknown): void {
    this.selectedOwner.set(typeof value === 'string' ? value : null);
  }
}
`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[34rem] gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold text-slate-500">Release owner</span>
    <p class="m-0 text-sm text-slate-600">
      Host-level semantic tokens restyle the wrapper cleanly from a utility-first shell.
    </p>
  </div>

  <tng-autocomplete
    class="block w-full [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#cbd5e1] [--tng-semantic-border-strong:#cbd5e1] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e]"
    [options]="releaseOwners"
    [value]="selectedOwner()"
    (valueChange)="onSelectedOwnerChange($event)"
    [getOptionValue]="getOwnerValue"
    [getOptionLabel]="getOwnerLabel"
    [isOptionDisabled]="isOwnerDisabled"
    placeholder="Assign a release owner"
    [ariaLabel]="'Release owner'"
  ></tng-autocomplete>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>
`;

const TAILWIND_CSS_CODE = String.raw`/* No additional CSS file is required for this Tailwind example. */`;

function resolveOwnerLabel(value: string | null): string {
  return OWNER_OPTIONS.find((owner) => owner.id === value)?.name ?? 'none';
}

@Component({
  selector: 'app-autocomplete-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngAutocompleteComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './autocomplete-styling-page.component.html',
  styleUrl: './autocomplete-styling-page.component.css',
})
export class AutocompleteStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly releaseOwners = OWNER_OPTIONS;
  protected readonly getOwnerValue = (owner: OwnerOption) => owner.id;
  protected readonly getOwnerLabel = (owner: OwnerOption) => owner.name;
  protected readonly isOwnerDisabled = (owner: OwnerOption) => owner.disabled === true;
  protected readonly plainOwner = signal<string | null>('mina');
  protected readonly tailwindOwner = signal<string | null>('abigail');
  protected readonly plainSummary = computed(() => resolveOwnerLabel(this.plainOwner()));
  protected readonly tailwindSummary = computed(() => resolveOwnerLabel(this.tailwindOwner()));
  protected readonly portalGuidanceCode = PORTAL_GUIDANCE_CODE;

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: 'tng-autocomplete',
      appliedOn: 'Wrapper host',
      purpose: 'Width, margins, host-level semantic tokens, and disabled state affordance.',
    },
    {
      selector: 'tng-autocomplete[data-disabled]',
      appliedOn: 'Wrapper host',
      purpose: 'Optional wrapper-level disabled presentation for surrounding shells.',
    },
    {
      selector: '--tng-semantic-background-canvas',
      appliedOn: 'Wrapper host',
      purpose: 'Trigger input surface background.',
    },
    {
      selector: '--tng-semantic-background-surface',
      appliedOn: 'Wrapper host',
      purpose: 'Trigger shell fill and default neutral state.',
    },
    {
      selector: '--tng-semantic-border-subtle',
      appliedOn: 'Wrapper host',
      purpose: 'Outer border color for the owned trigger shell.',
    },
    {
      selector: '--tng-semantic-border-strong',
      appliedOn: 'Wrapper host',
      purpose: 'Hover and resting border emphasis for the trigger shell.',
    },
    {
      selector: '--tng-semantic-foreground-primary',
      appliedOn: 'Wrapper host',
      purpose: 'Input text and selected option text color.',
    },
    {
      selector: '--tng-semantic-foreground-secondary',
      appliedOn: 'Wrapper host',
      purpose: 'Supporting copy and option helper color inside the owned theme.',
    },
    {
      selector: '--tng-semantic-accent-brand',
      appliedOn: 'Wrapper host',
      purpose: 'Selected row, active row, and icon accent color.',
    },
    {
      selector: '--tng-semantic-focus-ring',
      appliedOn: 'Wrapper host',
      purpose: 'Focus ring color around the owned trigger shell.',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-styling-plain.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-styling-plain.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-styling-plain.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'autocomplete-styling-tailwind.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'autocomplete-styling-tailwind.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'autocomplete-styling-tailwind.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected onPlainOwnerChange(value: unknown): void {
    this.plainOwner.set(typeof value === 'string' ? value : null);
  }

  protected onTailwindOwnerChange(value: unknown): void {
    this.tailwindOwner.set(typeof value === 'string' ? value : null);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
