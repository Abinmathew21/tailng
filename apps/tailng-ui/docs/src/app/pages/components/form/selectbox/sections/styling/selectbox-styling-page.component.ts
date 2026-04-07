import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent, TngSelectComponent } from '@tailng-ui/components';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../selectbox.util';

interface ContractRow {
  readonly selector: string;
  readonly appliedOn: string;
  readonly purpose: string;
}

interface ReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const RELEASE_OWNER_OPTIONS: readonly ReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

const HOST_TOKEN_GUIDANCE_CODE = String.raw`tng-select.docs-component-selectbox-styling-release-owner-shell {
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;

  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #f8fafc;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}

/* The wrapper owns trigger and overlay structure. */
/* Use headless select when you need direct DOM ownership of the menu shell. */`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxStylingPlainReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_STYLING_PLAIN_RELEASE_OWNER_OPTIONS: readonly ComponentSelectboxStylingPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-component-selectbox-styling-plain-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-styling-plain-example.component.html',
  styleUrl: './component-selectbox-styling-plain-example.component.css',
})
export class ComponentSelectboxStylingPlainExampleComponent {
  readonly componentSelectboxStylingPlainReleaseOwners = COMPONENT_SELECTBOX_STYLING_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly componentSelectboxStylingPlainSelectedOwnerId = signal<string | null>('mina');
  readonly componentSelectboxStylingPlainSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectboxStylingPlainSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxStylingPlainReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectboxStylingPlainOwnerValue = (owner: ComponentSelectboxStylingPlainReleaseOwnerOption) => owner.id;
  readonly getComponentSelectboxStylingPlainOwnerLabel = (owner: ComponentSelectboxStylingPlainReleaseOwnerOption) => owner.name;
  readonly isComponentSelectboxStylingPlainOwnerDisabled = (owner: ComponentSelectboxStylingPlainReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectboxStylingPlainSelectedOwnerChange(value: unknown): void {
    this.componentSelectboxStylingPlainSelectedOwnerId.set(this.toComponentSelectboxStylingPlainSingleValue(value));
  }

  private toComponentSelectboxStylingPlainSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-selectbox-styling-plain-shell">
  <div class="docs-component-selectbox-styling-plain-header">
    <span class="docs-component-selectbox-styling-plain-kicker">Release owners</span>
    <p class="docs-component-selectbox-styling-plain-copy">
      Host-level tokens restyle the wrapper without reaching into private trigger or overlay markup.
    </p>
  </div>

  <tng-select
    class="docs-component-selectbox-styling-plain-control docs-component-selectbox-styling-release-owner-shell"
    [options]="componentSelectboxStylingPlainReleaseOwners"
    [value]="componentSelectboxStylingPlainSelectedOwnerId()"
    (valueChange)="onComponentSelectboxStylingPlainSelectedOwnerChange($event)"
    [getOptionValue]="getComponentSelectboxStylingPlainOwnerValue"
    [getOptionLabel]="getComponentSelectboxStylingPlainOwnerLabel"
    [isOptionDisabled]="isComponentSelectboxStylingPlainOwnerDisabled"
    placeholder="Assign release owner"
    [ariaLabel]="'Release owners'"
  ></tng-select>

  <p class="docs-component-selectbox-styling-plain-summary">
    Selected: {{ componentSelectboxStylingPlainSelectedOwnerSummary() }}
  </p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-selectbox-styling-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.1rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.25rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-component-selectbox-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-selectbox-styling-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-component-selectbox-styling-plain-copy,
.docs-component-selectbox-styling-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-component-selectbox-styling-release-owner-shell {
  display: block;
  width: 100%;
  min-width: 0;
  --tng-semantic-background-canvas: #ffffff;
  --tng-semantic-background-surface: #f8fafc;
  --tng-semantic-border-subtle: #d8e2ef;
  --tng-semantic-border-strong: #94a3b8;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-secondary: #475569;
  --tng-semantic-foreground-muted: #64748b;
  --tng-semantic-accent-brand: #0f766e;
  --tng-semantic-focus-ring: #0f766e;
  --tng-select-radius: 1rem;
  --tng-select-trigger-py: 0.625rem;
  --tng-select-trigger-px: 0.875rem;
  --tng-select-option-py: 0.625rem;
  --tng-select-option-px: 0.875rem;
  --tng-select-bg: #ffffff;
  --tng-select-surface: #f8fafc;
  --tng-select-border: #d8e2ef;
  --tng-select-border-strong: #94a3b8;
  --tng-select-fg: #0f172a;
  --tng-select-muted: #64748b;
  --tng-select-brand: #0f766e;
  --tng-select-focus-ring: #0f766e;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import { TngSelectComponent } from '@tailng-ui/components';

interface ComponentSelectboxStylingTailwindReleaseOwnerOption {
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly disabled?: boolean;
}

const COMPONENT_SELECTBOX_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS: readonly ComponentSelectboxStylingTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation' },
]);

@Component({
  selector: 'app-component-selectbox-styling-tailwind-example',
  standalone: true,
  imports: [TngSelectComponent],
  templateUrl: './component-selectbox-styling-tailwind-example.component.html',
  styleUrl: './component-selectbox-styling-tailwind-example.component.css',
})
export class ComponentSelectboxStylingTailwindExampleComponent {
  readonly componentSelectboxStylingTailwindReleaseOwners = COMPONENT_SELECTBOX_STYLING_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly componentSelectboxStylingTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly componentSelectboxStylingTailwindSelectedOwnerSummary = computed(() => {
    const selectedValue = this.componentSelectboxStylingTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return 'none';
    }

    return this.componentSelectboxStylingTailwindReleaseOwners.find((owner) => owner.id === selectedValue)?.name ?? 'none';
  });
  readonly getComponentSelectboxStylingTailwindOwnerValue = (owner: ComponentSelectboxStylingTailwindReleaseOwnerOption) => owner.id;
  readonly getComponentSelectboxStylingTailwindOwnerLabel = (owner: ComponentSelectboxStylingTailwindReleaseOwnerOption) => owner.name;
  readonly isComponentSelectboxStylingTailwindOwnerDisabled = (owner: ComponentSelectboxStylingTailwindReleaseOwnerOption) => owner.disabled === true;

  onComponentSelectboxStylingTailwindSelectedOwnerChange(value: unknown): void {
    this.componentSelectboxStylingTailwindSelectedOwnerId.set(this.toComponentSelectboxStylingTailwindSingleValue(value));
  }

  private toComponentSelectboxStylingTailwindSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owners</span>
    <p class="m-0 text-sm text-slate-600">
      Host-level tokens restyle the wrapper cleanly from a utility-first shell.
    </p>
  </div>

  <tng-select
    class="block w-full min-w-0 [--tng-semantic-background-canvas:#ffffff] [--tng-semantic-background-surface:#f8fafc] [--tng-semantic-border-subtle:#d8e2ef] [--tng-semantic-border-strong:#94a3b8] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-secondary:#475569] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#0f766e] [--tng-semantic-focus-ring:#0f766e] [--tng-select-radius:1rem] [--tng-select-trigger-py:0.625rem] [--tng-select-trigger-px:0.875rem] [--tng-select-option-py:0.625rem] [--tng-select-option-px:0.875rem] [--tng-select-bg:#ffffff] [--tng-select-surface:#f8fafc] [--tng-select-border:#d8e2ef] [--tng-select-border-strong:#94a3b8] [--tng-select-fg:#0f172a] [--tng-select-muted:#64748b] [--tng-select-brand:#0f766e] [--tng-select-focus-ring:#0f766e]"
    [options]="componentSelectboxStylingTailwindReleaseOwners"
    [value]="componentSelectboxStylingTailwindSelectedOwnerId()"
    (valueChange)="onComponentSelectboxStylingTailwindSelectedOwnerChange($event)"
    [getOptionValue]="getComponentSelectboxStylingTailwindOwnerValue"
    [getOptionLabel]="getComponentSelectboxStylingTailwindOwnerLabel"
    [isOptionDisabled]="isComponentSelectboxStylingTailwindOwnerDisabled"
    placeholder="Assign release owner"
    [ariaLabel]="'Release owners'"
  ></tng-select>

  <p class="m-0 text-xs text-slate-600">Selected: {{ componentSelectboxStylingTailwindSelectedOwnerSummary() }}</p>
</section>`;

const TAILWIND_CSS_CODE = '/* Tailwind utilities are applied directly in the template. */';

@Component({
  selector: 'app-selectbox-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngSelectComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './selectbox-styling-page.component.html',
  styleUrl: './selectbox-styling-page.component.css',
})
export class SelectboxStylingPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly releaseOwnerLabelByValue = new Map(
    RELEASE_OWNER_OPTIONS.map((owner) => [owner.id, owner.name]),
  );

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );

  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly releaseOwners = RELEASE_OWNER_OPTIONS;
  protected readonly stylingPlainSelectedOwnerId = signal<string | null>('mina');
  protected readonly stylingTailwindSelectedOwnerId = signal<string | null>('abigail');
  protected readonly hostTokenGuidanceCode = HOST_TOKEN_GUIDANCE_CODE;
  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;

  protected readonly contractRows: readonly ContractRow[] = Object.freeze([
    {
      selector: '<tng-select> + --tng-select-*',
      appliedOn: 'Wrapper host',
      purpose: 'Stable surface for trigger, option, and overlay theming through copied host tokens.',
    },
    {
      selector: '--tng-semantic-*',
      appliedOn: 'Wrapper host',
      purpose: 'Feeds the shared light and dark semantic palette used by the select contract.',
    },
    {
      selector: '#tngSelectValueTpl',
      appliedOn: 'Projected template',
      purpose: 'Customizes the selected-value markup while preserving trigger semantics.',
    },
    {
      selector: '#tngSelectOptionTpl',
      appliedOn: 'Projected template',
      purpose: 'Customizes option rows while preserving listbox behavior and selection state.',
    },
  ]);

  protected readonly plainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-styling-plain-example.component.ts', code: PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-styling-plain-example.component.html', code: PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-styling-plain-example.component.css', code: PLAIN_CSS_CODE },
  ]);

  protected readonly tailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'component-selectbox-styling-tailwind-example.component.ts', code: TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'component-selectbox-styling-tailwind-example.component.html', code: TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'component-selectbox-styling-tailwind-example.component.css', code: TAILWIND_CSS_CODE },
  ]);

  protected readonly getReleaseOwnerValue = (owner: ReleaseOwnerOption) => owner.id;
  protected readonly getReleaseOwnerLabel = (owner: ReleaseOwnerOption) => owner.name;
  protected readonly isReleaseOwnerDisabled = (owner: ReleaseOwnerOption) => owner.disabled === true;

  protected readonly stylingPlainSummary = computed(() => this.resolveReleaseOwnerLabel(this.stylingPlainSelectedOwnerId()));
  protected readonly stylingTailwindSummary = computed(() => this.resolveReleaseOwnerLabel(this.stylingTailwindSelectedOwnerId()));

  protected onStylingPlainSelectedOwnerChange(value: unknown): void {
    this.stylingPlainSelectedOwnerId.set(this.toSingleValue(value));
  }

  protected onStylingTailwindSelectedOwnerChange(value: unknown): void {
    this.stylingTailwindSelectedOwnerId.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveReleaseOwnerLabel(value: string | null): string {
    if (value === null) {
      return 'none';
    }

    return this.releaseOwnerLabelByValue.get(value) ?? 'none';
  }

  private toSingleValue(value: unknown): string | null {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      return typeof first === 'string' ? first : null;
    }

    return null;
  }
}
