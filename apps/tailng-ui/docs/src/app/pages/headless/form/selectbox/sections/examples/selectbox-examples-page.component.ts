import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../selectbox.util';

interface ReleaseStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

interface ReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
}

type SelectboxValue = string | readonly string[] | null;

const RELEASE_STAGE_OPTIONS: readonly ReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

const RELEASE_OWNER_OPTIONS: readonly ReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

const STAGE_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxExamplesStagePlainReleaseStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

type HeadlessSelectboxExamplesStagePlainValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_EXAMPLES_STAGE_PLAIN_RELEASE_STAGE_OPTIONS: readonly HeadlessSelectboxExamplesStagePlainReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-headless-selectbox-examples-stage-plain',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-examples-stage-plain.component.html',
  styleUrl: './headless-selectbox-examples-stage-plain.component.css',
})
export class HeadlessSelectboxExamplesStagePlainComponent {
  readonly headlessSelectboxExamplesStagePlainReleaseStages =
    HEADLESS_SELECTBOX_EXAMPLES_STAGE_PLAIN_RELEASE_STAGE_OPTIONS;
  readonly headlessSelectboxExamplesStagePlainSelectedStage = signal<string | null>('review');
  readonly headlessSelectboxExamplesStagePlainSelectedStageLabel = computed(() => {
    const selectedValue = this.headlessSelectboxExamplesStagePlainSelectedStage();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxExamplesStagePlainReleaseStages.find(
        (stage) => stage.value === selectedValue,
      )?.label ?? null
    );
  });
  readonly headlessSelectboxExamplesStagePlainSelectedStageSummary = computed(() =>
    this.headlessSelectboxExamplesStagePlainSelectedStageLabel() ?? 'none',
  );

  onHeadlessSelectboxExamplesStagePlainSelectedStageChange(
    value: HeadlessSelectboxExamplesStagePlainValue,
  ): void {
    this.headlessSelectboxExamplesStagePlainSelectedStage.set(
      this.toHeadlessSelectboxExamplesStagePlainSingleValue(value),
    );
  }

  private toHeadlessSelectboxExamplesStagePlainSingleValue(
    value: HeadlessSelectboxExamplesStagePlainValue,
  ): string | null {
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

const STAGE_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-selectbox-examples-stage-plain-shell">
  <div class="docs-headless-selectbox-examples-stage-plain-header">
    <span class="docs-headless-selectbox-examples-stage-plain-kicker">Release stage</span>
    <p class="docs-headless-selectbox-examples-stage-plain-copy">
      Keep a controlled release-stage value while the primitive owns the interaction contract.
    </p>
  </div>

  <section
    tngSelect
    class="docs-headless-selectbox-examples-stage-plain-root"
    [value]="headlessSelectboxExamplesStagePlainSelectedStage()"
    (valueChange)="onHeadlessSelectboxExamplesStagePlainSelectedStageChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-selectbox-examples-stage-plain-trigger">
      <span
        tngSelectValue
        class="docs-headless-selectbox-examples-stage-plain-value"
        [attr.data-placeholder]="headlessSelectboxExamplesStagePlainSelectedStageLabel() === null ? '' : null"
      >
        {{ headlessSelectboxExamplesStagePlainSelectedStageLabel() ?? 'Choose release stage' }}
      </span>
      <span tngSelectIcon class="docs-headless-selectbox-examples-stage-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-selectbox-examples-stage-plain-content">
      <div tngSelectOverlay class="docs-headless-selectbox-examples-stage-plain-overlay">
        <div
          tngSelectListbox
          class="docs-headless-selectbox-examples-stage-plain-listbox"
          [value]="headlessSelectboxExamplesStagePlainSelectedStage()"
          (valueChange)="onHeadlessSelectboxExamplesStagePlainSelectedStageChange($event)"
        >
          @for (stage of headlessSelectboxExamplesStagePlainReleaseStages; track stage.value) {
            <div
              tngSelectOption
              class="docs-headless-selectbox-examples-stage-plain-option"
              [tngValue]="stage.value"
              [disabled]="stage.disabled === true"
            >
              <p class="docs-headless-selectbox-examples-stage-plain-option-label">{{ stage.label }}</p>
              <p class="docs-headless-selectbox-examples-stage-plain-option-meta">{{ stage.note }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="docs-headless-selectbox-examples-stage-plain-summary">
    Selected: {{ headlessSelectboxExamplesStagePlainSelectedStageSummary() }}
  </p>
</section>`;

const STAGE_PLAIN_CSS_CODE = String.raw`.docs-headless-selectbox-examples-stage-plain-shell {
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

.docs-headless-selectbox-examples-stage-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-selectbox-examples-stage-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-selectbox-examples-stage-plain-copy,
.docs-headless-selectbox-examples-stage-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-selectbox-examples-stage-plain-root {
  display: block;
  width: 100%;
}

.docs-headless-selectbox-examples-stage-plain-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
  cursor: pointer;
}

.docs-headless-selectbox-examples-stage-plain-trigger:focus,
.docs-headless-selectbox-examples-stage-plain-trigger:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}

.docs-headless-selectbox-examples-stage-plain-value[data-placeholder] {
  color: #64748b;
}

.docs-headless-selectbox-examples-stage-plain-icon {
  color: #64748b;
  font-size: 0.75rem;
}

.docs-headless-selectbox-examples-stage-plain-content {
  display: contents;
}

.docs-headless-selectbox-examples-stage-plain-overlay {
  max-inline-size: min(92vw, 36rem);
  border: 1px solid #d8e2ef;
  border-radius: 1rem;
  background: #ffffff;
  padding: 0.4rem;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}

.docs-headless-selectbox-examples-stage-plain-listbox {
  display: grid;
  gap: 0.25rem;
}

.docs-headless-selectbox-examples-stage-plain-option {
  display: grid;
  gap: 0.2rem;
  padding: 0.75rem 0.85rem;
  border: 1px solid transparent;
  border-radius: 0.85rem;
}

.docs-headless-selectbox-examples-stage-plain-option[data-active] {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.docs-headless-selectbox-examples-stage-plain-option[data-selected] {
  background: #eff6ff;
  border-color: #93c5fd;
}

.docs-headless-selectbox-examples-stage-plain-option[data-selected][data-active] {
  background: #dbeafe;
  border-color: #60a5fa;
}

.docs-headless-selectbox-examples-stage-plain-option[data-disabled] {
  opacity: 0.52;
  cursor: not-allowed;
}

.docs-headless-selectbox-examples-stage-plain-option-label,
.docs-headless-selectbox-examples-stage-plain-option-meta {
  margin: 0;
}

.docs-headless-selectbox-examples-stage-plain-option-label {
  font-weight: 600;
  color: #0f172a;
}

.docs-headless-selectbox-examples-stage-plain-option-meta {
  color: #64748b;
  font-size: 0.875rem;
}`;

const STAGE_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxExamplesStageTailwindReleaseStageOption {
  readonly disabled?: boolean;
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

type HeadlessSelectboxExamplesStageTailwindValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_EXAMPLES_STAGE_TAILWIND_RELEASE_STAGE_OPTIONS: readonly HeadlessSelectboxExamplesStageTailwindReleaseStageOption[] = Object.freeze([
  { value: 'draft', label: 'Draft', note: 'Internal drafting only.' },
  { value: 'review', label: 'In review', note: 'Editorial sign-off in progress.' },
  { value: 'qa', label: 'QA ready', note: 'Approved for validation.' },
  { value: 'scheduled', label: 'Scheduled', note: 'Queued for launch.', disabled: true },
]);

@Component({
  selector: 'app-headless-selectbox-examples-stage-tailwind',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-examples-stage-tailwind.component.html',
  styleUrl: './headless-selectbox-examples-stage-tailwind.component.css',
})
export class HeadlessSelectboxExamplesStageTailwindComponent {
  readonly headlessSelectboxExamplesStageTailwindReleaseStages =
    HEADLESS_SELECTBOX_EXAMPLES_STAGE_TAILWIND_RELEASE_STAGE_OPTIONS;
  readonly headlessSelectboxExamplesStageTailwindSelectedStage = signal<string | null>('qa');
  readonly headlessSelectboxExamplesStageTailwindSelectedStageLabel = computed(() => {
    const selectedValue = this.headlessSelectboxExamplesStageTailwindSelectedStage();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxExamplesStageTailwindReleaseStages.find(
        (stage) => stage.value === selectedValue,
      )?.label ?? null
    );
  });
  readonly headlessSelectboxExamplesStageTailwindSelectedStageSummary = computed(() =>
    this.headlessSelectboxExamplesStageTailwindSelectedStageLabel() ?? 'none',
  );

  onHeadlessSelectboxExamplesStageTailwindSelectedStageChange(
    value: HeadlessSelectboxExamplesStageTailwindValue,
  ): void {
    this.headlessSelectboxExamplesStageTailwindSelectedStage.set(
      this.toHeadlessSelectboxExamplesStageTailwindSingleValue(value),
    );
  }

  private toHeadlessSelectboxExamplesStageTailwindSingleValue(
    value: HeadlessSelectboxExamplesStageTailwindValue,
  ): string | null {
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

const STAGE_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release stage</span>
    <p class="m-0 text-sm text-slate-600">
      Keep a controlled release-stage value while the primitive owns the interaction contract.
    </p>
  </div>

  <section
    tngSelect
    class="block w-full"
    [value]="headlessSelectboxExamplesStageTailwindSelectedStage()"
    (valueChange)="onHeadlessSelectboxExamplesStageTailwindSelectedStageChange($event)"
  >
    <button
      type="button"
      tngSelectTrigger
      class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
    >
      <span
        tngSelectValue
        class="min-w-0 truncate"
        [attr.data-placeholder]="headlessSelectboxExamplesStageTailwindSelectedStageLabel() === null ? '' : null"
      >
        {{ headlessSelectboxExamplesStageTailwindSelectedStageLabel() ?? 'Choose release stage' }}
      </span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
        <div
          tngSelectListbox
          class="grid gap-1"
          [value]="headlessSelectboxExamplesStageTailwindSelectedStage()"
          (valueChange)="onHeadlessSelectboxExamplesStageTailwindSelectedStageChange($event)"
        >
          @for (stage of headlessSelectboxExamplesStageTailwindReleaseStages; track stage.value) {
            <div
              tngSelectOption
              class="grid gap-1 rounded-xl border border-transparent px-4 py-3 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-blue-200 data-[selected]:bg-blue-50 data-[selected]:text-blue-800 [&[data-selected][data-active]]:border-blue-400 [&[data-selected][data-active]]:bg-blue-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="stage.value"
              [disabled]="stage.disabled === true"
            >
              <p class="m-0 text-sm font-semibold text-current">{{ stage.label }}</p>
              <p class="m-0 text-sm text-slate-500">{{ stage.note }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessSelectboxExamplesStageTailwindSelectedStageSummary() }}</p>
</section>`;

const STAGE_TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

const OWNER_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxExamplesOwnerPlainReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
}

type HeadlessSelectboxExamplesOwnerPlainValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_EXAMPLES_OWNER_PLAIN_RELEASE_OWNER_OPTIONS: readonly HeadlessSelectboxExamplesOwnerPlainReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-headless-selectbox-examples-owner-plain',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-examples-owner-plain.component.html',
  styleUrl: './headless-selectbox-examples-owner-plain.component.css',
})
export class HeadlessSelectboxExamplesOwnerPlainComponent {
  readonly headlessSelectboxExamplesOwnerPlainReleaseOwners =
    HEADLESS_SELECTBOX_EXAMPLES_OWNER_PLAIN_RELEASE_OWNER_OPTIONS;
  readonly headlessSelectboxExamplesOwnerPlainSelectedOwnerId = signal<string | null>('mina');
  readonly headlessSelectboxExamplesOwnerPlainSelectedOwner = computed(() => {
    const selectedValue = this.headlessSelectboxExamplesOwnerPlainSelectedOwnerId();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxExamplesOwnerPlainReleaseOwners.find(
        (owner) => owner.id === selectedValue,
      ) ?? null
    );
  });
  readonly headlessSelectboxExamplesOwnerPlainSelectedOwnerSummary = computed(() =>
    this.headlessSelectboxExamplesOwnerPlainSelectedOwner()?.name ?? 'none',
  );

  onHeadlessSelectboxExamplesOwnerPlainSelectedOwnerChange(
    value: HeadlessSelectboxExamplesOwnerPlainValue,
  ): void {
    this.headlessSelectboxExamplesOwnerPlainSelectedOwnerId.set(
      this.toHeadlessSelectboxExamplesOwnerPlainSingleValue(value),
    );
  }

  private toHeadlessSelectboxExamplesOwnerPlainSingleValue(
    value: HeadlessSelectboxExamplesOwnerPlainValue,
  ): string | null {
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

const OWNER_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-selectbox-examples-owner-plain-shell">
  <div class="docs-headless-selectbox-examples-owner-plain-header">
    <span class="docs-headless-selectbox-examples-owner-plain-kicker">Release owner roster</span>
    <p class="docs-headless-selectbox-examples-owner-plain-copy">
      Own the trigger value and option markup directly when the selected state needs richer metadata.
    </p>
  </div>

  <section
    tngSelect
    class="docs-headless-selectbox-examples-owner-plain-root"
    [value]="headlessSelectboxExamplesOwnerPlainSelectedOwnerId()"
    (valueChange)="onHeadlessSelectboxExamplesOwnerPlainSelectedOwnerChange($event)"
  >
    <button type="button" tngSelectTrigger class="docs-headless-selectbox-examples-owner-plain-trigger">
      <span tngSelectValue class="docs-headless-selectbox-examples-owner-plain-value-block">
        @if (headlessSelectboxExamplesOwnerPlainSelectedOwner(); as owner) {
          <span class="docs-headless-selectbox-examples-owner-plain-value-label">{{ owner.name }}</span>
          <span class="docs-headless-selectbox-examples-owner-plain-value-meta">{{ owner.team }} · {{ owner.timezone }}</span>
        } @else {
          <span class="docs-headless-selectbox-examples-owner-plain-value-placeholder">Assign release owner</span>
        }
      </span>
      <span tngSelectIcon class="docs-headless-selectbox-examples-owner-plain-icon" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="docs-headless-selectbox-examples-owner-plain-content">
      <div tngSelectOverlay class="docs-headless-selectbox-examples-owner-plain-overlay">
        <div
          tngSelectListbox
          class="docs-headless-selectbox-examples-owner-plain-listbox"
          [value]="headlessSelectboxExamplesOwnerPlainSelectedOwnerId()"
          (valueChange)="onHeadlessSelectboxExamplesOwnerPlainSelectedOwnerChange($event)"
        >
          @for (owner of headlessSelectboxExamplesOwnerPlainReleaseOwners; track owner.id) {
            <div
              tngSelectOption
              class="docs-headless-selectbox-examples-owner-plain-option"
              [tngValue]="owner.id"
              [disabled]="owner.disabled === true"
            >
              <p class="docs-headless-selectbox-examples-owner-plain-option-label">{{ owner.name }}</p>
              <p class="docs-headless-selectbox-examples-owner-plain-option-meta">{{ owner.team }} · {{ owner.timezone }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="docs-headless-selectbox-examples-owner-plain-summary">
    Selected: {{ headlessSelectboxExamplesOwnerPlainSelectedOwnerSummary() }}
  </p>
</section>`;

const OWNER_PLAIN_CSS_CODE = String.raw`.docs-headless-selectbox-examples-owner-plain-shell {
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

.docs-headless-selectbox-examples-owner-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-selectbox-examples-owner-plain-kicker {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
}

.docs-headless-selectbox-examples-owner-plain-copy,
.docs-headless-selectbox-examples-owner-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-selectbox-examples-owner-plain-root {
  display: block;
  width: 100%;
}

.docs-headless-selectbox-examples-owner-plain-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  border: 1px solid #94a3b8;
  border-radius: 1rem;
  background: #ffffff;
  cursor: pointer;
}

.docs-headless-selectbox-examples-owner-plain-trigger:focus,
.docs-headless-selectbox-examples-owner-plain-trigger:focus-visible {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.16);
}

.docs-headless-selectbox-examples-owner-plain-value-block {
  display: grid;
  flex: 1 1 auto;
  gap: 0.15rem;
  min-width: 0;
  text-align: left;
}

.docs-headless-selectbox-examples-owner-plain-value-label {
  font-weight: 600;
  color: #0f172a;
}

.docs-headless-selectbox-examples-owner-plain-value-meta,
.docs-headless-selectbox-examples-owner-plain-value-placeholder {
  color: #64748b;
  font-size: 0.875rem;
}

.docs-headless-selectbox-examples-owner-plain-icon {
  color: #64748b;
  font-size: 0.75rem;
}

.docs-headless-selectbox-examples-owner-plain-content {
  display: contents;
}

.docs-headless-selectbox-examples-owner-plain-overlay {
  max-inline-size: min(92vw, 36rem);
  border: 1px solid #d8e2ef;
  border-radius: 1rem;
  background: #ffffff;
  padding: 0.4rem;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.14);
}

.docs-headless-selectbox-examples-owner-plain-listbox {
  display: grid;
  gap: 0.3rem;
}

.docs-headless-selectbox-examples-owner-plain-option {
  display: grid;
  gap: 0.15rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  background: #f8fafc;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    box-shadow 120ms ease,
    opacity 120ms ease;
}

.docs-headless-selectbox-examples-owner-plain-option[data-active] {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.docs-headless-selectbox-examples-owner-plain-option[data-selected] {
  background: #ecfeff;
  border-color: #5eead4;
}

.docs-headless-selectbox-examples-owner-plain-option[data-selected][data-active] {
  background: #ccfbf1;
  border-color: #2dd4bf;
  box-shadow: 0 0 0 1px rgba(13, 148, 136, 0.14);
}

.docs-headless-selectbox-examples-owner-plain-option[data-disabled] {
  opacity: 0.52;
  cursor: not-allowed;
}

.docs-headless-selectbox-examples-owner-plain-option-label,
.docs-headless-selectbox-examples-owner-plain-option-meta {
  margin: 0;
}

.docs-headless-selectbox-examples-owner-plain-option-label {
  font-weight: 600;
  color: #0f172a;
}

.docs-headless-selectbox-examples-owner-plain-option-meta {
  color: #64748b;
  font-size: 0.875rem;
}`;

const OWNER_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  TngSelect,
  TngSelectContent,
  TngSelectIcon,
  TngSelectListbox,
  TngSelectOption,
  TngSelectOverlay,
  TngSelectTrigger,
  TngSelectValue,
} from '@tailng-ui/primitives';

interface HeadlessSelectboxExamplesOwnerTailwindReleaseOwnerOption {
  readonly disabled?: boolean;
  readonly id: string;
  readonly name: string;
  readonly team: string;
  readonly timezone: string;
}

type HeadlessSelectboxExamplesOwnerTailwindValue = string | readonly string[] | null;

const HEADLESS_SELECTBOX_EXAMPLES_OWNER_TAILWIND_RELEASE_OWNER_OPTIONS: readonly HeadlessSelectboxExamplesOwnerTailwindReleaseOwnerOption[] = Object.freeze([
  { id: 'abigail', name: 'Abigail Chen', team: 'Design systems', timezone: 'UTC-8' },
  { id: 'mina', name: 'Mina Lee', team: 'Core UI', timezone: 'UTC-5' },
  { id: 'omar', name: 'Omar Aziz', team: 'Compliance', timezone: 'UTC+1', disabled: true },
  { id: 'sanjay', name: 'Sanjay Patel', team: 'Documentation', timezone: 'UTC+5:30' },
]);

@Component({
  selector: 'app-headless-selectbox-examples-owner-tailwind',
  standalone: true,
  imports: [
    TngSelect,
    TngSelectTrigger,
    TngSelectValue,
    TngSelectIcon,
    TngSelectContent,
    TngSelectOverlay,
    TngSelectListbox,
    TngSelectOption,
  ],
  templateUrl: './headless-selectbox-examples-owner-tailwind.component.html',
  styleUrl: './headless-selectbox-examples-owner-tailwind.component.css',
})
export class HeadlessSelectboxExamplesOwnerTailwindComponent {
  readonly headlessSelectboxExamplesOwnerTailwindReleaseOwners =
    HEADLESS_SELECTBOX_EXAMPLES_OWNER_TAILWIND_RELEASE_OWNER_OPTIONS;
  readonly headlessSelectboxExamplesOwnerTailwindSelectedOwnerId = signal<string | null>('abigail');
  readonly headlessSelectboxExamplesOwnerTailwindSelectedOwner = computed(() => {
    const selectedValue = this.headlessSelectboxExamplesOwnerTailwindSelectedOwnerId();
    if (selectedValue === null) {
      return null;
    }

    return (
      this.headlessSelectboxExamplesOwnerTailwindReleaseOwners.find(
        (owner) => owner.id === selectedValue,
      ) ?? null
    );
  });
  readonly headlessSelectboxExamplesOwnerTailwindSelectedOwnerSummary = computed(() =>
    this.headlessSelectboxExamplesOwnerTailwindSelectedOwner()?.name ?? 'none',
  );

  onHeadlessSelectboxExamplesOwnerTailwindSelectedOwnerChange(
    value: HeadlessSelectboxExamplesOwnerTailwindValue,
  ): void {
    this.headlessSelectboxExamplesOwnerTailwindSelectedOwnerId.set(
      this.toHeadlessSelectboxExamplesOwnerTailwindSingleValue(value),
    );
  }

  private toHeadlessSelectboxExamplesOwnerTailwindSingleValue(
    value: HeadlessSelectboxExamplesOwnerTailwindValue,
  ): string | null {
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

const OWNER_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid max-w-[36rem] gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm [color-scheme:light]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Release owner roster</span>
    <p class="m-0 text-sm text-slate-600">
      Own the trigger value and option markup directly when the selected state needs richer metadata.
    </p>
  </div>

  <section
    tngSelect
    class="block w-full"
    [value]="headlessSelectboxExamplesOwnerTailwindSelectedOwnerId()"
    (valueChange)="onHeadlessSelectboxExamplesOwnerTailwindSelectedOwnerChange($event)"
  >
    <button
      type="button"
      tngSelectTrigger
      class="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-100"
    >
      <span tngSelectValue class="grid min-w-0 flex-1 gap-0.5 text-left">
        @if (headlessSelectboxExamplesOwnerTailwindSelectedOwner(); as owner) {
          <span class="truncate text-sm font-semibold text-slate-900">{{ owner.name }}</span>
          <span class="truncate text-xs text-slate-500">{{ owner.team }} · {{ owner.timezone }}</span>
        } @else {
          <span class="truncate text-sm text-slate-500">Assign release owner</span>
        }
      </span>
      <span tngSelectIcon class="text-xs text-slate-500" aria-hidden="true">▾</span>
    </button>

    <div tngSelectContent class="contents">
      <div tngSelectOverlay class="max-w-[min(92vw,36rem)] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
        <div
          tngSelectListbox
          class="grid gap-1"
          [value]="headlessSelectboxExamplesOwnerTailwindSelectedOwnerId()"
          (valueChange)="onHeadlessSelectboxExamplesOwnerTailwindSelectedOwnerChange($event)"
        >
          @for (owner of headlessSelectboxExamplesOwnerTailwindReleaseOwners; track owner.id) {
            <div
              tngSelectOption
              class="grid gap-1 rounded-xl border border-transparent px-4 py-3 transition data-[active]:border-slate-200 data-[active]:bg-slate-50 data-[selected]:border-teal-200 data-[selected]:bg-teal-50 data-[selected]:text-teal-800 [&[data-selected][data-active]]:border-teal-400 [&[data-selected][data-active]]:bg-teal-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45"
              [tngValue]="owner.id"
              [disabled]="owner.disabled === true"
            >
              <p class="m-0 text-sm font-semibold text-current">{{ owner.name }}</p>
              <p class="m-0 text-sm text-slate-500">{{ owner.team }} · {{ owner.timezone }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  </section>

  <p class="m-0 text-xs text-slate-600">Selected: {{ headlessSelectboxExamplesOwnerTailwindSelectedOwnerSummary() }}</p>
</section>`;

const OWNER_TAILWIND_CSS_CODE = String.raw`/* No additional CSS required. Tailwind utility classes define the shell. */`;

@Component({
  selector: 'app-headless-selectbox-examples-page',
  imports: [TngSelect, TngSelectTrigger, TngSelectValue, TngSelectIcon, TngSelectContent, TngSelectOverlay, TngSelectListbox, TngSelectOption, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './selectbox-examples-page.component.html',
  styleUrl: './selectbox-examples-page.component.css',
})
export class HeadlessSelectboxExamplesPageComponent implements OnDestroy {
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
  protected readonly releaseStages = RELEASE_STAGE_OPTIONS;
  protected readonly releaseOwners = RELEASE_OWNER_OPTIONS;

  protected readonly releaseStagePlainSelectedValue = signal<string | null>('review');
  protected readonly releaseStageTailwindSelectedValue = signal<string | null>('qa');
  protected readonly releaseOwnerPlainSelectedValue = signal<string | null>('mina');
  protected readonly releaseOwnerTailwindSelectedValue = signal<string | null>('abigail');

  protected readonly releaseStagePlainSummary = computed(() =>
    this.findStageLabel(this.releaseStagePlainSelectedValue()) ?? 'none',
  );
  protected readonly releaseStageTailwindSummary = computed(() =>
    this.findStageLabel(this.releaseStageTailwindSelectedValue()) ?? 'none',
  );
  protected readonly releaseOwnerPlainSelectedOwner = computed(() =>
    this.findOwner(this.releaseOwnerPlainSelectedValue()),
  );
  protected readonly releaseOwnerTailwindSelectedOwner = computed(() =>
    this.findOwner(this.releaseOwnerTailwindSelectedValue()),
  );
  protected readonly releaseOwnerPlainSummary = computed(
    () => this.releaseOwnerPlainSelectedOwner()?.name ?? 'none',
  );
  protected readonly releaseOwnerTailwindSummary = computed(
    () => this.releaseOwnerTailwindSelectedOwner()?.name ?? 'none',
  );

  protected readonly releaseStagePlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-examples-stage-plain.component.ts', code: STAGE_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-examples-stage-plain.component.html', code: STAGE_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-examples-stage-plain.component.css', code: STAGE_PLAIN_CSS_CODE },
  ]);
  protected readonly releaseStageTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-examples-stage-tailwind.component.ts', code: STAGE_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-examples-stage-tailwind.component.html', code: STAGE_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-examples-stage-tailwind.component.css', code: STAGE_TAILWIND_CSS_CODE },
  ]);
  protected readonly releaseOwnerPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-examples-owner-plain.component.ts', code: OWNER_PLAIN_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-examples-owner-plain.component.html', code: OWNER_PLAIN_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-examples-owner-plain.component.css', code: OWNER_PLAIN_CSS_CODE },
  ]);
  protected readonly releaseOwnerTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: 'headless-selectbox-examples-owner-tailwind.component.ts', code: OWNER_TAILWIND_TS_CODE },
    { value: 'html', label: 'HTML', language: 'html', title: 'headless-selectbox-examples-owner-tailwind.component.html', code: OWNER_TAILWIND_HTML_CODE },
    { value: 'css', label: 'CSS', language: 'css', title: 'headless-selectbox-examples-owner-tailwind.component.css', code: OWNER_TAILWIND_CSS_CODE },
  ]);

  protected onReleaseStagePlainSelectedValueChange(value: SelectboxValue): void {
    this.releaseStagePlainSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseStageTailwindSelectedValueChange(value: SelectboxValue): void {
    this.releaseStageTailwindSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseOwnerPlainSelectedValueChange(value: SelectboxValue): void {
    this.releaseOwnerPlainSelectedValue.set(this.toSingleValue(value));
  }

  protected onReleaseOwnerTailwindSelectedValueChange(value: SelectboxValue): void {
    this.releaseOwnerTailwindSelectedValue.set(this.toSingleValue(value));
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  private findStageLabel(value: string | null): string | null {
    if (value === null) {
      return null;
    }

    return this.releaseStages.find((stage) => stage.value === value)?.label ?? null;
  }

  private findOwner(value: string | null): ReleaseOwnerOption | null {
    if (value === null) {
      return null;
    }

    return this.releaseOwners.find((owner) => owner.id === value) ?? null;
  }

  private toSingleValue(value: SelectboxValue): string | null {
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
