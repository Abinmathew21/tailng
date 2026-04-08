import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngMultiSelect,
  TngMultiSelectListbox,
  TngMultiSelectOption,
  TngSelectContent,
  TngSelectIcon,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../multiselect.util';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const STATUS_OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do', note: 'Not yet started.' },
  { value: 'progress', label: 'In progress', note: 'Work is underway.' },
  { value: 'review', label: 'In review', note: 'Pending sign-off.' },
  { value: 'blocked', label: 'Blocked', note: 'Awaiting resolution.', disabled: true },
  { value: 'done', label: 'Done', note: 'Completed and shipped.' },
]);

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

const STATUS_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect, TngMultiSelectListbox, TngMultiSelectOption,
  TngSelectContent, TngSelectIcon, TngSelectOverlay, TngSelectTrigger, TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessMultiselectExamplesPlainStatusOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const OPTIONS: readonly HeadlessMultiselectExamplesPlainStatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do', note: 'Not yet started.' },
  { value: 'progress', label: 'In progress', note: 'Work is underway.' },
  { value: 'review', label: 'In review', note: 'Pending sign-off.' },
  { value: 'blocked', label: 'Blocked', note: 'Awaiting resolution.', disabled: true },
  { value: 'done', label: 'Done', note: 'Completed and shipped.' },
]);

@Component({
  selector: 'app-headless-multiselect-examples-plain-status',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './headless-multiselect-examples-plain-status.component.html',
  styleUrl: './headless-multiselect-examples-plain-status.component.css',
})
export class HeadlessMultiselectExamplesPlainStatusComponent {
  readonly statusOptions = OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['todo', 'review']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedStatuses();
    if (ids.length === 0) return 'Select statuses';
    return ids.map((id) => this.statusOptions.find((s) => s.value === id)?.label ?? id).join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const STATUS_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-multiselect-examples-plain-shell">
  <div class="docs-headless-multiselect-examples-plain-header">
    <span class="docs-headless-multiselect-examples-plain-kicker">Status filter</span>
    <p class="docs-headless-multiselect-examples-plain-copy">Toggle multiple statuses without closing the panel.</p>
  </div>

  <section tngMultiSelect class="docs-headless-multiselect-examples-plain-root" [value]="selectedStatuses()" (valueChange)="onValueChange($event)">
    <button type="button" tngSelectTrigger class="docs-headless-multiselect-examples-plain-trigger">
      <span tngSelectValue class="docs-headless-multiselect-examples-plain-value">{{ selectedSummary() }}</span>
      <span tngSelectIcon class="docs-headless-multiselect-examples-plain-icon" aria-hidden="true">▾</span>
    </button>
    <div tngSelectContent class="docs-headless-multiselect-examples-plain-content">
      <div tngSelectOverlay class="docs-headless-multiselect-examples-plain-overlay">
        <ul tngMultiSelectListbox class="docs-headless-multiselect-examples-plain-listbox" [multiple]="true" [value]="selectedStatuses()">
          @for (status of statusOptions; track status.value) {
            <li tngMultiSelectOption class="docs-headless-multiselect-examples-plain-option" [tngValue]="status.value" [disabled]="status.disabled === true">
              <p class="docs-headless-multiselect-examples-plain-option-label">{{ status.label }}</p>
              <p class="docs-headless-multiselect-examples-plain-option-meta">{{ status.note }}</p>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>
  <p class="docs-headless-multiselect-examples-plain-summary">Selected: {{ selectedSummary() }}</p>
</section>`;

const STATUS_PLAIN_CSS_CODE = String.raw`.docs-headless-multiselect-examples-plain-shell {
  display: grid; gap: 0.9rem; inline-size: min(100%, 36rem); margin-inline: auto;
  padding: 1.1rem; border: 1px solid #cbd5e1; border-radius: 1.25rem;
  background: #fff; color: #0f172a; color-scheme: light;
  box-shadow: 0 12px 32px rgba(15,23,42,0.08);
}
.docs-headless-multiselect-examples-plain-header { display: grid; gap: 0.35rem; }
.docs-headless-multiselect-examples-plain-kicker { font-size: 0.8rem; font-weight: 700; color: #64748b; }
.docs-headless-multiselect-examples-plain-copy,
.docs-headless-multiselect-examples-plain-summary { margin: 0; color: #475569; }
.docs-headless-multiselect-examples-plain-root { display: block; width: 100%; }
.docs-headless-multiselect-examples-plain-trigger {
  display: flex; width: 100%; min-width: 0; align-items: center; justify-content: space-between;
  gap: 0.75rem; padding: 0.8rem 0.95rem; border: 1px solid #94a3b8; border-radius: 1rem;
  background: #fff; color: #0f172a; cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}
.docs-headless-multiselect-examples-plain-trigger:hover { border-color: #64748b; }
.docs-headless-multiselect-examples-plain-trigger:focus,
.docs-headless-multiselect-examples-plain-trigger:focus-visible {
  outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.18);
}
.docs-headless-multiselect-examples-plain-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.docs-headless-multiselect-examples-plain-icon { color: #64748b; font-size: 0.75rem; }
.docs-headless-multiselect-examples-plain-content { display: contents; }
.docs-headless-multiselect-examples-plain-overlay {
  max-inline-size: min(92vw,36rem); border: 1px solid #d8e2ef; border-radius: 1rem;
  background: #fff; color: #0f172a; color-scheme: light;
  padding: 0.4rem; box-shadow: 0 18px 38px rgba(15,23,42,0.14);
}
.docs-headless-multiselect-examples-plain-listbox { display: grid; gap: 0.25rem; list-style: none; margin: 0; padding: 0; }
.docs-headless-multiselect-examples-plain-option {
  display: grid; gap: 0.2rem; padding: 0.75rem 0.85rem; border: 1px solid transparent;
  border-radius: 0.85rem; color: #0f172a; font-weight: 500;
  transition: all 120ms ease; cursor: pointer;
}
.docs-headless-multiselect-examples-plain-option[data-active] { background: #f8fafc; border-color: #cbd5e1; }
.docs-headless-multiselect-examples-plain-option[data-selected] { background: #eff6ff; border-color: #93c5fd; }
.docs-headless-multiselect-examples-plain-option[data-selected][data-active] { background: #dbeafe; border-color: #60a5fa; }
.docs-headless-multiselect-examples-plain-option[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.docs-headless-multiselect-examples-plain-option-label, .docs-headless-multiselect-examples-plain-option-meta { margin: 0; }
.docs-headless-multiselect-examples-plain-option-label { font-weight: 600; color: #0f172a; }
.docs-headless-multiselect-examples-plain-option-meta { color: #64748b; font-size: 0.875rem; }`;

const STATUS_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect, TngMultiSelectListbox, TngMultiSelectOption,
  TngSelectContent, TngSelectIcon, TngSelectOverlay, TngSelectTrigger, TngSelectValue,
} from '@tailng-ui/primitives';

interface StatusOption {
  readonly value: string;
  readonly label: string;
  readonly note: string;
  readonly disabled?: boolean;
}

const OPTIONS: readonly StatusOption[] = Object.freeze([
  { value: 'todo', label: 'To do', note: 'Not yet started.' },
  { value: 'progress', label: 'In progress', note: 'Work is underway.' },
  { value: 'review', label: 'In review', note: 'Pending sign-off.' },
  { value: 'blocked', label: 'Blocked', note: 'Awaiting resolution.', disabled: true },
  { value: 'done', label: 'Done', note: 'Completed and shipped.' },
]);

@Component({
  selector: 'app-headless-multiselect-examples-tailwind-status',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './headless-multiselect-examples-tailwind-status.component.html',
})
export class HeadlessMultiselectExamplesTailwindStatusComponent {
  readonly statusOptions = OPTIONS;
  readonly selectedStatuses = signal<readonly string[]>(['done']);
  readonly selectedSummary = computed(() => {
    const ids = this.selectedStatuses();
    if (ids.length === 0) return 'Select statuses';
    return ids.map((id) => this.statusOptions.find((s) => s.value === id)?.label ?? id).join(', ');
  });

  onValueChange(value: unknown): void {
    this.selectedStatuses.set(this.toValueArray(value));
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const STATUS_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status filter</span>
    <p class="m-0 text-sm text-slate-600">Toggle multiple statuses without closing the panel.</p>
  </div>

  <section tngMultiSelect class="block w-full" [value]="selectedStatuses()" (valueChange)="onValueChange($event)">
    <button type="button" tngSelectTrigger class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100">
      <span tngSelectValue class="min-w-0 truncate">{{ selectedSummary() }}</span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
        <ul tngMultiSelectListbox class="m-0 grid list-none gap-1 p-0" [multiple]="true" [value]="selectedStatuses()">
          @for (status of statusOptions; track status.value) {
            <li
              tngMultiSelectOption
              class="grid gap-1 rounded-xl border border-transparent px-4 py-3 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-emerald-200 data-[selected]:bg-emerald-50 data-[selected]:text-emerald-800 [&[data-selected][data-active]]:border-emerald-400 [&[data-selected][data-active]]:bg-emerald-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="status.value"
              [disabled]="status.disabled === true"
            >
              <p class="m-0 text-sm font-semibold text-current">{{ status.label }}</p>
              <p class="m-0 text-sm text-slate-500">{{ status.note }}</p>
            </li>
          }
        </ul>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ selectedSummary() }}</p>
</section>`;

const STATUS_TAILWIND_CSS_CODE = '/* No additional CSS required. Tailwind utility classes define the shell. */';

const TAG_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect, TngMultiSelectListbox, TngMultiSelectOption,
  TngSelectContent, TngSelectIcon, TngSelectOverlay, TngSelectTrigger, TngSelectValue,
} from '@tailng-ui/primitives';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-headless-multiselect-examples-tag-group',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './tag-group.component.html',
  styleUrl: './tag-group.component.css',
})
export class TagGroupComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));

  onTagAValueChange(value: unknown): void { this.tagValueA.set(this.toValueArray(value)); }
  onTagBValueChange(value: unknown): void { this.tagValueB.set(this.toValueArray(value)); }

  private resolveLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((v) => this.tagOptions.find((t) => t.value === v)?.label ?? v).join(', ');
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const TAG_PLAIN_HTML_CODE = String.raw`<section class="tag-group-shell">
  <div class="tag-group-header">
    <span class="tag-group-kicker">Tag group roster</span>
    <p class="tag-group-copy">
      Use Tab to move between controls; each multiselect keeps independent roving option state.
    </p>
  </div>

  <div class="tag-group-grid">
    <section class="tag-group-card">
      <h4 class="tag-group-card-title">Tag group A</h4>
      <section tngMultiSelect class="tag-group-root" [value]="tagValueA()" (valueChange)="onTagAValueChange($event)">
        <button type="button" tngSelectTrigger class="tag-group-trigger">
          <span tngSelectValue class="tag-group-value">{{ tagSummaryA() }}</span>
          <span tngSelectIcon class="tag-group-icon" aria-hidden="true">▾</span>
        </button>
        <div tngSelectContent class="tag-group-content">
          <div tngSelectOverlay class="tag-group-overlay">
            <ul tngMultiSelectListbox class="tag-group-listbox" [multiple]="true" [value]="tagValueA()">
              @for (tag of tagOptions; track tag.value) {
                <li tngMultiSelectOption class="tag-group-option" [tngValue]="tag.value">{{ tag.label }}</li>
              }
            </ul>
          </div>
        </div>
      </section>
      <p class="tag-group-summary">Selected: {{ tagSummaryA() }}</p>
    </section>

    <section class="tag-group-card">
      <h4 class="tag-group-card-title">Tag group B</h4>
      <section tngMultiSelect class="tag-group-root" [value]="tagValueB()" (valueChange)="onTagBValueChange($event)">
        <button type="button" tngSelectTrigger class="tag-group-trigger">
          <span tngSelectValue class="tag-group-value">{{ tagSummaryB() }}</span>
          <span tngSelectIcon class="tag-group-icon" aria-hidden="true">▾</span>
        </button>
        <div tngSelectContent class="tag-group-content">
          <div tngSelectOverlay class="tag-group-overlay">
            <ul tngMultiSelectListbox class="tag-group-listbox" [multiple]="true" [value]="tagValueB()">
              @for (tag of tagOptions; track tag.value) {
                <li tngMultiSelectOption class="tag-group-option" [tngValue]="tag.value">{{ tag.label }}</li>
              }
            </ul>
          </div>
        </div>
      </section>
      <p class="tag-group-summary">Selected: {{ tagSummaryB() }}</p>
    </section>
  </div>
</section>`;

const TAG_PLAIN_CSS_CODE = String.raw`.tag-group-shell {
  display: grid; gap: 0.9rem; inline-size: min(100%, 48rem); margin-inline: auto;
  padding: 1.1rem; border: 1px solid #cbd5e1; border-radius: 1.25rem;
  background: #fff; color: #0f172a; color-scheme: light;
  box-shadow: 0 12px 32px rgba(15,23,42,0.08);
}
.tag-group-header { display: grid; gap: 0.35rem; }
.tag-group-kicker { font-size: 0.8rem; font-weight: 700; color: #64748b; }
.tag-group-copy { margin: 0; color: #475569; }
.tag-group-grid { display: grid; gap: 1rem; }
@media (min-width: 40rem) { .tag-group-grid { grid-template-columns: 1fr 1fr; } }
.tag-group-card {
  display: grid; gap: 0.65rem; padding: 0.9rem;
  border: 1px solid #e2e8f0; border-radius: 0.75rem;
}
.tag-group-card-title { font-size: 0.95rem; font-weight: 600; margin: 0; color: #0f172a; }
.tag-group-root { display: block; width: 100%; }
.tag-group-trigger {
  display: flex; width: 100%; min-width: 0; align-items: center; justify-content: space-between;
  gap: 0.75rem; padding: 0.8rem 0.95rem; border: 1px solid #94a3b8; border-radius: 1rem;
  background: #fff; color: #0f172a; cursor: pointer;
  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}
.tag-group-trigger:hover { border-color: #64748b; }
.tag-group-trigger:focus, .tag-group-trigger:focus-visible {
  outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.18);
}
.tag-group-value { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tag-group-icon { color: #64748b; font-size: 0.75rem; }
.tag-group-content { display: contents; }
.tag-group-overlay {
  max-inline-size: min(92vw,36rem); border: 1px solid #d8e2ef; border-radius: 1rem;
  background: #fff; color: #0f172a; color-scheme: light;
  padding: 0.4rem; box-shadow: 0 18px 38px rgba(15,23,42,0.14);
}
.tag-group-listbox { display: grid; gap: 0.25rem; list-style: none; margin: 0; padding: 0; }
.tag-group-option {
  padding: 0.75rem 0.85rem; border: 1px solid transparent; border-radius: 0.85rem;
  color: #0f172a; font-weight: 500; cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.tag-group-option[data-active] { background: #f8fafc; border-color: #cbd5e1; }
.tag-group-option[data-selected] { background: #eff6ff; border-color: #93c5fd; }
.tag-group-option[data-selected][data-active] { background: #dbeafe; border-color: #60a5fa; box-shadow: 0 0 0 1px rgba(37,99,235,0.12); }
.tag-group-option[data-disabled] { opacity: 0.5; cursor: not-allowed; }
.tag-group-summary { margin: 0; font-size: 0.875rem; color: #475569; }`;

const TAG_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngMultiSelect, TngMultiSelectListbox, TngMultiSelectOption,
  TngSelectContent, TngSelectIcon, TngSelectOverlay, TngSelectTrigger, TngSelectValue,
} from '@tailng-ui/primitives';

interface TagOption {
  readonly value: string;
  readonly label: string;
}

const TAG_OPTIONS: readonly TagOption[] = Object.freeze([
  { value: 'a11y', label: 'A11y' },
  { value: 'forms', label: 'Forms' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'docs', label: 'Docs' },
]);

@Component({
  selector: 'app-headless-multiselect-examples-tailwind-tag-group',
  standalone: true,
  imports: [TngMultiSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngMultiSelectListbox, TngMultiSelectOption],
  templateUrl: './tag-group-tailwind.component.html',
})
export class TagGroupTailwindComponent {
  readonly tagOptions = TAG_OPTIONS;
  readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  readonly tagValueB = signal<readonly string[]>(['forms']);
  readonly tagSummaryA = computed(() => this.resolveLabels(this.tagValueA()));
  readonly tagSummaryB = computed(() => this.resolveLabels(this.tagValueB()));

  onTagAValueChange(value: unknown): void { this.tagValueA.set(this.toValueArray(value)); }
  onTagBValueChange(value: unknown): void { this.tagValueB.set(this.toValueArray(value)); }

  private resolveLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((v) => this.tagOptions.find((t) => t.value === v)?.label ?? v).join(', ');
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}`;

const TAG_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-3xl gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Tag group roster</span>
    <p class="m-0 text-sm text-slate-600">Use Tab to move between controls; each multiselect keeps independent roving option state.</p>
  </div>

  <div class="grid gap-4 sm:grid-cols-2">
    <section class="grid gap-2.5 rounded-xl border border-slate-200 p-4">
      <h4 class="m-0 text-[0.95rem] font-semibold text-slate-900">Tag group A</h4>
      <section tngMultiSelect class="block w-full" [value]="tagValueA()" (valueChange)="onTagAValueChange($event)">
        <button type="button" tngSelectTrigger class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100">
          <span tngSelectValue class="min-w-0 truncate">{{ tagSummaryA() }}</span>
          <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
        </button>
        <div tngSelectContent class="contents">
          <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
            <ul tngMultiSelectListbox class="m-0 grid list-none gap-1 p-0" [multiple]="true" [value]="tagValueA()">
              @for (tag of tagOptions; track tag.value) {
                <li tngMultiSelectOption class="rounded-xl border border-transparent px-4 py-3 text-slate-900 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-800 [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45" [tngValue]="tag.value">{{ tag.label }}</li>
              }
            </ul>
          </div>
        </div>
      </section>
      <p class="m-0 text-xs text-slate-500">Selected: {{ tagSummaryA() }}</p>
    </section>

    <section class="grid gap-2.5 rounded-xl border border-slate-200 p-4">
      <h4 class="m-0 text-[0.95rem] font-semibold text-slate-900">Tag group B</h4>
      <section tngMultiSelect class="block w-full" [value]="tagValueB()" (valueChange)="onTagBValueChange($event)">
        <button type="button" tngSelectTrigger class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100">
          <span tngSelectValue class="min-w-0 truncate">{{ tagSummaryB() }}</span>
          <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
        </button>
        <div tngSelectContent class="contents">
          <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 text-slate-900 shadow-2xl [color-scheme:light]">
            <ul tngMultiSelectListbox class="m-0 grid list-none gap-1 p-0" [multiple]="true" [value]="tagValueB()">
              @for (tag of tagOptions; track tag.value) {
                <li tngMultiSelectOption class="rounded-xl border border-transparent px-4 py-3 text-slate-900 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-800 [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45" [tngValue]="tag.value">{{ tag.label }}</li>
              }
            </ul>
          </div>
        </div>
      </section>
      <p class="m-0 text-xs text-slate-500">Selected: {{ tagSummaryB() }}</p>
    </section>
  </div>
</section>`;

const TAG_TAILWIND_CSS_CODE = '/* No additional CSS required. Tailwind utility classes define the shell. */';

@Component({
  selector: 'app-headless-multiselect-examples-page',
  imports: [
    TngMultiSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngMultiSelectListbox,
    TngMultiSelectOption,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './multiselect-examples-page.component.html',
  styleUrl: './multiselect-examples-page.component.css',
})
export class HeadlessMultiselectExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly statusLabelByValue = new Map(
    STATUS_OPTIONS.map((s) => [s.value, s.label]),
  );
  private readonly tagLabelByValue = new Map(
    TAG_OPTIONS.map((t) => [t.value, t.label]),
  );

  readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly stackblitzVanillaUrl = stackblitzVanillaUrl;
  protected readonly stackblitzTailwindUrl = stackblitzTailwindUrl;
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly tagOptions = TAG_OPTIONS;

  protected readonly examplesPlainSelectedStatuses = signal<readonly string[]>(['todo', 'review']);
  protected readonly examplesTailwindSelectedStatuses = signal<readonly string[]>(['done']);
  protected readonly tagValueA = signal<readonly string[]>(['a11y', 'docs']);
  protected readonly tagValueB = signal<readonly string[]>(['forms']);
  protected readonly tagTailwindValueA = signal<readonly string[]>(['a11y', 'docs']);
  protected readonly tagTailwindValueB = signal<readonly string[]>(['forms']);

  protected readonly examplesPlainSummary = computed(() => this.resolveStatusLabels(this.examplesPlainSelectedStatuses()));
  protected readonly examplesTailwindSummary = computed(() => this.resolveStatusLabels(this.examplesTailwindSelectedStatuses()));
  protected readonly tagSummaryA = computed(() => this.resolveTagLabels(this.tagValueA()));
  protected readonly tagSummaryB = computed(() => this.resolveTagLabels(this.tagValueB()));
  protected readonly tagTailwindSummaryA = computed(() => this.resolveTagLabels(this.tagTailwindValueA()));
  protected readonly tagTailwindSummaryB = computed(() => this.resolveTagLabels(this.tagTailwindValueB()));

  protected readonly statusPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-examples-plain-status.component.ts', code: STATUS_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-examples-plain-status.component.html', code: STATUS_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-examples-plain-status.component.css', code: STATUS_PLAIN_CSS_CODE },
  ]);

  protected readonly statusTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-multiselect-examples-tailwind-status.component.ts', code: STATUS_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-multiselect-examples-tailwind-status.component.html', code: STATUS_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-multiselect-examples-tailwind-status.component.css', code: STATUS_TAILWIND_CSS_CODE },
  ]);

  protected readonly tagPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'tag-group.component.ts', code: TAG_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'tag-group.component.html', code: TAG_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'tag-group.component.css', code: TAG_PLAIN_CSS_CODE },
  ]);

  protected readonly tagTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'tag-group-tailwind.component.ts', code: TAG_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'tag-group-tailwind.component.html', code: TAG_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'tag-group-tailwind.component.css', code: TAG_TAILWIND_CSS_CODE },
  ]);

  protected onExamplesPlainValueChange(value: unknown): void {
    this.examplesPlainSelectedStatuses.set(this.toValueArray(value));
  }

  protected onExamplesTailwindValueChange(value: unknown): void {
    this.examplesTailwindSelectedStatuses.set(this.toValueArray(value));
  }

  protected onTagAValueChange(value: unknown): void {
    this.tagValueA.set(this.toValueArray(value));
  }

  protected onTagBValueChange(value: unknown): void {
    this.tagValueB.set(this.toValueArray(value));
  }

  protected onTagTailwindAValueChange(value: unknown): void {
    this.tagTailwindValueA.set(this.toValueArray(value));
  }

  protected onTagTailwindBValueChange(value: unknown): void {
    this.tagTailwindValueB.set(this.toValueArray(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private resolveStatusLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((v) => this.statusLabelByValue.get(v) ?? v).join(', ');
  }

  private resolveTagLabels(values: readonly string[]): string {
    if (values.length === 0) return 'none';
    return values.map((v) => this.tagLabelByValue.get(v) ?? v).join(', ');
  }

  private toValueArray(value: unknown): readonly string[] {
    if (value === null || value === undefined) return [];
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    return typeof value === 'string' ? [value] : [];
  }
}
