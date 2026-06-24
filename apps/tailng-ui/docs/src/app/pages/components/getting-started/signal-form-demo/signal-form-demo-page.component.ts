import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  type OnDestroy,
  type WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, form, pattern as patternValidator, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import {
  TngAutocompleteComponent,
  TngButtonComponent,
  TngButtonToggleComponent,
  TngButtonToggleGroupComponent,
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCheckboxComponent,
  TngChipsComponent,
  TngDatepickerComponent,
  TngDateRangePickerComponent,
  TngInputFieldComponent,
  TngInputComponent,
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
import { map } from 'rxjs/operators';
import type { DocsExampleCodeTab } from '../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

type AccessType = 'temporary' | 'permanent';
type Environment = 'development' | 'staging' | 'production';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type AccessPeriod = Readonly<{ start: Date | null; end: Date | null }>;

type DemoOption = Readonly<{
  value: string;
  label: string;
  description?: string;
}>;

type DemoClasses = Readonly<{
  shell: string;
  form: string;
  section: string;
  control: string;
  stack: string;
  gridTwo: string;
  gridThree: string;
  gridFour: string;
  fullWidth: string;
  choiceGroup: string;
  labelRow: string;
  summary: string;
  actions: string;
  submitted: string;
  submittedPre: string;
  preview: string;
  previewPre: string;
}>;

type WorkspaceAccessRequest = Readonly<{
  requestTitle: string;
  requesterEmail: string;
  dateOfBirth: Date | null;
  verificationCode: string;
  department: string | null;
  managerId: string | null;
  reviewers: readonly string[];
  requestedApps: readonly string[];
  accessChannels: readonly string[];
  accessType: AccessType;
  environment: Environment;
  priority: Priority;
  accessPeriod: AccessPeriod;
  renewalMonthDay: { month: number; day: number } | undefined;
  budgetYear: number | undefined;
  riskTolerance: number;
  businessJustification: string;
  requiresPrivilegedAccess: boolean;
  allowWeekendAccess: boolean;
  acknowledgePolicy: boolean;
  notifyOnApproval: boolean;
  tags: readonly string[];
}>;

const signalFormDemoItem = COMPONENTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'signal-form-demo',
);

if (signalFormDemoItem === undefined) {
  throw new Error('Signal Form Demo item not found.');
}

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_GETTING_STARTED_GROUP,
  signalFormDemoItem,
);

const departmentOptions: readonly DemoOption[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'security', label: 'Security' },
  { value: 'support', label: 'Customer Support' },
  { value: 'finance', label: 'Finance' },
];

const peopleOptions: readonly DemoOption[] = [
  { value: 'maya', label: 'Maya Chen' },
  { value: 'noah', label: 'Noah Patel' },
  { value: 'sofia', label: 'Sofia Garcia' },
  { value: 'liam', label: 'Liam Brooks' },
];

const appOptions: readonly DemoOption[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'datadog', label: 'Datadog' },
  { value: 'cloudflare', label: 'Cloudflare' },
  { value: 'aws', label: 'AWS Console' },
  { value: 'figma', label: 'Figma' },
];

const channelOptions: readonly DemoOption[] = [
  {
    value: 'sso',
    label: 'SSO',
    description: 'Browser-based access through the identity provider.',
  },
  { value: 'vpn', label: 'VPN', description: 'Network-level access for private services.' },
  { value: 'api', label: 'API token', description: 'Machine access for integrations.' },
  { value: 'ssh', label: 'SSH', description: 'Shell access for infrastructure tasks.' },
];

const initialRequest: WorkspaceAccessRequest = {
  requestTitle: 'Production observability access',
  requesterEmail: 'demo@tailng.com',
  dateOfBirth: new Date(1990, 2, 15),
  verificationCode: '123456',
  department: 'engineering',
  managerId: 'maya',
  reviewers: ['maya', 'sofia'],
  requestedApps: ['github', 'datadog'],
  accessChannels: ['sso', 'api'],
  accessType: 'temporary',
  environment: 'production',
  priority: 'high',
  accessPeriod: {
    start: new Date(2024, 3, 22),
    end: new Date(2024, 3, 24),
  },
  renewalMonthDay: { month: 5, day: 8 },
  budgetYear: 2026,
  riskTolerance: 65,
  businessJustification:
    'Investigate customer-facing latency regressions and prepare a post-incident report.',
  requiresPrivilegedAccess: true,
  allowWeekendAccess: false,
  acknowledgePolicy: true,
  notifyOnApproval: true,
  tags: ['incident-response', 'temporary', 'customer-facing'],
};

const plainCssDemoClasses: DemoClasses = {
  shell: 'signal-form-demo',
  form: 'demo-form',
  section: 'demo-section',
  control: 'demo-control',
  stack: 'demo-stack',
  gridTwo: 'demo-grid two-columns',
  gridThree: 'demo-grid three-columns',
  gridFour: 'demo-grid four-columns',
  fullWidth: 'full-width',
  choiceGroup: 'demo-choice-group',
  labelRow: 'demo-label-row',
  summary: 'demo-summary',
  actions: 'demo-actions',
  submitted: 'demo-submitted',
  submittedPre: '',
  preview: 'demo-preview',
  previewPre: '',
};

const tailwindDemoClasses: DemoClasses = {
  shell: 'grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start',
  form: 'grid gap-4',
  section:
    'grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40',
  control: 'grid gap-2',
  stack:
    'grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/60',
  gridTwo: 'grid gap-4 md:grid-cols-2',
  gridThree: 'grid gap-4 md:grid-cols-3',
  gridFour: 'grid gap-4 md:grid-cols-4',
  fullWidth: 'md:col-span-full',
  choiceGroup: 'grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700',
  labelRow: 'flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400',
  summary:
    'block rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:bg-sky-950/50 dark:text-sky-200',
  actions: 'grid justify-items-start gap-3',
  submitted:
    'grid w-full gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-700',
  submittedPre:
    'm-0 max-h-[360px] w-full overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-200',
  preview:
    'grid gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-700',
  previewPre:
    'm-0 max-h-[720px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-200',
};

const signalFormPlainCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'signal-form-plain-css-demo.component.ts',
    code: String.raw`import { Component, computed, signal } from '@angular/core';
import { FormField, form, pattern, required } from '@angular/forms/signals';
import {
  TngButtonComponent,
  TngCheckboxComponent,
  TngChipsComponent,
  TngInputComponent,
  TngLabelComponent,
  TngMultiAutocompleteComponent,
  TngMultiSelectComponent,
  TngSliderComponent,
  TngTextareaComponent,
} from '@tailng-ui/components';

type AccessRequest = {
  title: string;
  email: string;
  reviewers: readonly string[];
  apps: readonly string[];
  risk: number;
  justification: string;
  acknowledged: boolean;
  tags: readonly string[];
};

const people = [
  { value: 'maya', label: 'Maya Chen' },
  { value: 'sofia', label: 'Sofia Garcia' },
  { value: 'liam', label: 'Liam Brooks' },
] as const;

const apps = [
  { value: 'github', label: 'GitHub' },
  { value: 'datadog', label: 'Datadog' },
  { value: 'aws', label: 'AWS Console' },
] as const;

@Component({
  selector: 'app-signal-form-plain-css-demo',
  standalone: true,
  imports: [
    FormField,
    TngButtonComponent,
    TngCheckboxComponent,
    TngChipsComponent,
    TngInputComponent,
    TngLabelComponent,
    TngMultiAutocompleteComponent,
    TngMultiSelectComponent,
    TngSliderComponent,
    TngTextareaComponent,
  ],
  templateUrl: './signal-form-plain-css-demo.component.html',
  styleUrl: './signal-form-plain-css-demo.component.css',
})
export class SignalFormPlainCssDemoComponent {
  protected readonly model = signal<AccessRequest>({
    title: 'Production observability access',
    email: 'demo@tailng.com',
    reviewers: ['maya', 'sofia'],
    apps: ['github', 'datadog'],
    risk: 65,
    justification: 'Investigate customer-facing latency regressions.',
    acknowledged: true,
    tags: ['incident-response', 'temporary'],
  });

  protected readonly requestForm = form(this.model, (request) => {
    required(request.title);
    pattern(request.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    required(request.acknowledged);
  });

  protected readonly people = people;
  protected readonly apps = apps;
  protected readonly reviewerQuery = signal('');
  protected readonly filteredReviewers = computed(() => {
    const query = this.reviewerQuery().toLowerCase().trim();
    return query === '' ? this.people : this.people.filter((person) => person.label.toLowerCase().includes(query));
  });
  protected readonly preview = computed(() => JSON.stringify(this.model(), null, 2));
  protected readonly submittedJson = signal<string | null>(null);

  protected readonly getOptionLabel = (option: { label: string }) => option.label;
  protected readonly getOptionValue = (option: { value: string }) => option.value;
  protected readonly resolvePersonLabel = (value: string) =>
    this.people.find((person) => person.value === value)?.label ?? value;

  protected submitRequest(event: Event): void {
    event.preventDefault();
    this.submittedJson.set(JSON.stringify(this.model(), null, 2));
  }

  protected updateField<K extends keyof AccessRequest>(key: K, value: AccessRequest[K]): void {
    this.model.update((current) => ({ ...current, [key]: value }));
  }

  protected updateTags(value: readonly unknown[]): void {
    this.updateField('tags', value.filter((item): item is string => typeof item === 'string'));
  }
}`,
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'signal-form-plain-css-demo.component.html',
    code: String.raw`<div class="signal-form-demo">
  <form class="demo-form" aria-label="Workspace access request" (submit)="submitRequest($event)">
    <section class="demo-section">
      <h2>Requester verification</h2>

      <div class="demo-grid two-columns">
        <div class="demo-control">
          <tng-label forId="request-title" required>Request title</tng-label>
          <tng-input
            id="request-title"
            placeholder="Production observability access"
            ariaLabel="Request title"
            [formField]="requestForm.title"
          />
        </div>

        <div class="demo-control">
          <tng-label forId="requester-email" required>Requester email</tng-label>
          <tng-input
            id="requester-email"
            type="email"
            placeholder="you@example.com"
            ariaLabel="Requester email"
            [formField]="requestForm.email"
          />
        </div>

        <div class="demo-control">
          <tng-label>Approvers</tng-label>
          <tng-multi-autocomplete
            ariaLabel="Approvers"
            placeholder="Search approvers"
            [options]="filteredReviewers()"
            [query]="reviewerQuery()"
            (queryChange)="reviewerQuery.set($event)"
            [getOptionLabel]="getOptionLabel"
            [getOptionValue]="getOptionValue"
            [resolveValueLabel]="resolvePersonLabel"
            [formField]="requestForm.reviewers"
          />
        </div>

        <div class="demo-control">
          <tng-label>Requested apps</tng-label>
          <tng-multiselect
            aria-label="Requested apps"
            placeholder="Choose apps"
            [options]="apps"
            [getOptionLabel]="getOptionLabel"
            [getOptionValue]="getOptionValue"
            [formField]="requestForm.apps"
          />
        </div>

        <div class="demo-control full-width">
          <tng-label forId="justification">Business justification</tng-label>
          <tng-textarea
            id="justification"
            ariaLabel="Business justification"
            [rows]="4"
            [value]="model().justification"
            (valueChange)="updateField('justification', $event)"
          />
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h2>Policy & metadata</h2>

      <div class="demo-control">
        <div class="demo-label-row">
          <tng-label>Risk tolerance</tng-label>
          <span>{{ model().risk }}</span>
        </div>
        <tng-slider
          [min]="0"
          [max]="100"
          [step]="5"
          [value]="model().risk"
          (valueChange)="updateField('risk', $event)"
        />
      </div>

      <tng-checkbox [formField]="requestForm.acknowledged">
        I acknowledge the access policy
      </tng-checkbox>

      <div class="demo-control">
        <tng-label>Tags</tng-label>
        <tng-chips
          ariaLabel="Request tags"
          [items]="model().tags"
          (valuesChange)="updateTags($event)"
        />
      </div>
    </section>

    <div class="demo-actions">
      <tng-button type="submit">Submit request</tng-button>

      @if (submittedJson(); as submitted) {
        <section class="demo-submitted" aria-label="Submitted signal form values">
          <h2>Submitted values</h2>
          <pre>{{ submitted }}</pre>
        </section>
      }
    </div>
  </form>

  <aside class="demo-preview" aria-label="Signal form model preview">
    <h2>Current model</h2>
    <pre>{{ preview() }}</pre>
  </aside>
</div>`,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'signal-form-plain-css-demo.component.css',
    code: String.raw`:host {
  display: block;
}

.signal-form-demo {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 1180px) {
  .signal-form-demo {
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }
}

.demo-form,
.demo-section,
.demo-control,
.demo-actions {
  display: grid;
  gap: 1rem;
}

.demo-section,
.demo-preview,
.demo-submitted {
  padding: 1rem;
  border: 1px solid var(--tng-color-border, rgba(148, 163, 184, 0.3));
  border-radius: 1rem;
}

.demo-actions {
  justify-items: start;
}

.demo-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 760px) {
  .demo-grid.two-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.full-width {
  grid-column: 1 / -1;
}

.demo-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.demo-preview pre,
.demo-submitted pre {
  overflow: auto;
  max-height: 520px;
  margin: 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #0f172a;
  color: #e2e8f0;
}`,
  },
]);

const signalFormTailwindCodeTabs: readonly DocsExampleCodeTab[] = Object.freeze([
  {
    value: 'ts',
    label: 'TS',
    language: 'ts',
    title: 'signal-form-tailwind-demo.component.ts',
    code: signalFormPlainCodeTabs[0].code
      .replace(/SignalFormPlainCssDemoComponent/g, 'SignalFormTailwindDemoComponent')
      .replace(/signal-form-plain-css-demo/g, 'signal-form-tailwind-demo'),
  },
  {
    value: 'html',
    label: 'HTML',
    language: 'html',
    title: 'signal-form-tailwind-demo.component.html',
    code: String.raw`<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
  <form class="grid gap-4" aria-label="Workspace access request" (submit)="submitRequest($event)">
    <section class="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
      <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">Requester verification</h2>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="grid gap-2">
          <tng-label forId="request-title" required>Request title</tng-label>
          <tng-input
            id="request-title"
            placeholder="Production observability access"
            ariaLabel="Request title"
            [formField]="requestForm.title"
          />
        </div>

        <div class="grid gap-2">
          <tng-label forId="requester-email" required>Requester email</tng-label>
          <tng-input
            id="requester-email"
            type="email"
            placeholder="you@example.com"
            ariaLabel="Requester email"
            [formField]="requestForm.email"
          />
        </div>

        <div class="grid gap-2">
          <tng-label>Approvers</tng-label>
          <tng-multi-autocomplete
            ariaLabel="Approvers"
            placeholder="Search approvers"
            [options]="filteredReviewers()"
            [query]="reviewerQuery()"
            (queryChange)="reviewerQuery.set($event)"
            [getOptionLabel]="getOptionLabel"
            [getOptionValue]="getOptionValue"
            [resolveValueLabel]="resolvePersonLabel"
            [formField]="requestForm.reviewers"
          />
        </div>

        <div class="grid gap-2">
          <tng-label>Requested apps</tng-label>
          <tng-multiselect
            aria-label="Requested apps"
            placeholder="Choose apps"
            [options]="apps"
            [getOptionLabel]="getOptionLabel"
            [getOptionValue]="getOptionValue"
            [formField]="requestForm.apps"
          />
        </div>

        <div class="grid gap-2 md:col-span-full">
          <tng-label forId="justification">Business justification</tng-label>
          <tng-textarea
            id="justification"
            ariaLabel="Business justification"
            [rows]="4"
            [value]="model().justification"
            (valueChange)="updateField('justification', $event)"
          />
        </div>
      </div>
    </section>

    <section class="grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
      <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">Policy & metadata</h2>

      <div class="grid gap-2">
        <div class="flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <tng-label>Risk tolerance</tng-label>
          <span>{{ model().risk }}</span>
        </div>
        <tng-slider
          [min]="0"
          [max]="100"
          [step]="5"
          [value]="model().risk"
          (valueChange)="updateField('risk', $event)"
        />
      </div>

      <tng-checkbox [formField]="requestForm.acknowledged">
        I acknowledge the access policy
      </tng-checkbox>

      <div class="grid gap-2">
        <tng-label>Tags</tng-label>
        <tng-chips
          ariaLabel="Request tags"
          [items]="model().tags"
          (valuesChange)="updateTags($event)"
        />
      </div>
    </section>

    <div class="grid justify-items-start gap-3">
      <tng-button type="submit">Submit request</tng-button>

      @if (submittedJson(); as submitted) {
        <section
          class="grid w-full gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-700"
          aria-label="Submitted signal form values"
        >
          <h2 class="text-base font-semibold">Submitted values</h2>
          <pre class="m-0 max-h-[360px] w-full overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-200">{{ submitted }}</pre>
        </section>
      }
    </div>
  </form>

  <aside class="grid gap-3 rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-700">
    <h2 class="text-base font-semibold">Current model</h2>
    <pre class="m-0 max-h-[520px] overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-200">{{ preview() }}</pre>
  </aside>
</div>`,
  },
  {
    value: 'css',
    label: 'CSS',
    language: 'css',
    title: 'signal-form-tailwind-demo.component.css',
    code: '/* Tailwind utilities are applied directly in the template. */',
  },
]);

@Component({
  selector: 'app-signal-form-demo-page',
  imports: [
    FormField,
    NgTemplateOutlet,
    TngAutocompleteComponent,
    TngButtonComponent,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
    TngCardComponent,
    TngCardContentComponent,
    TngCardDescriptionComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCheckboxComponent,
    TngChipsComponent,
    TngDatepickerComponent,
    TngDateRangePickerComponent,
    TngInputFieldComponent,
    TngInputComponent,
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
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './signal-form-demo-page.component.html',
  styleUrl: './signal-form-demo-page.component.css',
})
export class SignalFormDemoPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  protected readonly item = computed(() => this.routeData().item);
  protected readonly groupTitle = computed(() => this.routeData().groupTitle);
  protected readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly plainCssDemoClasses = plainCssDemoClasses;
  protected readonly tailwindDemoClasses = tailwindDemoClasses;
  protected readonly signalFormPlainCodeTabs = signalFormPlainCodeTabs;
  protected readonly signalFormTailwindCodeTabs = signalFormTailwindCodeTabs;

  protected readonly requestModel = signal<WorkspaceAccessRequest>(initialRequest);
  protected readonly requestForm = form(this.requestModel, (request) => {
    required(request.requestTitle);
    patternValidator(request.requesterEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    patternValidator(request.verificationCode, /^\d{6}$/);
    required(request.acknowledgePolicy);
  });
  protected readonly tailwindRequestModel = signal<WorkspaceAccessRequest>({
    ...initialRequest,
    requestTitle: 'Staging release access',
    requesterEmail: 'maya@example.com',
    verificationCode: '654321',
    environment: 'staging',
    priority: 'medium',
    riskTolerance: 35,
    tags: ['release-readiness', 'staging', 'temporary'],
  });
  protected readonly tailwindRequestForm = form(this.tailwindRequestModel, (request) => {
    required(request.requestTitle);
    patternValidator(request.requesterEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    patternValidator(request.verificationCode, /^\d{6}$/);
    required(request.acknowledgePolicy);
  });

  protected readonly departmentOptions = departmentOptions;
  protected readonly peopleOptions = peopleOptions;
  protected readonly appOptions = appOptions;
  protected readonly channelOptions = channelOptions;
  protected readonly reviewerQuery = signal('');
  protected readonly tailwindReviewerQuery = signal('');

  protected readonly getOptionValue = (option: DemoOption): string => option.value;
  protected readonly getOptionLabel = (option: DemoOption): string => option.label;
  protected readonly getOptionDescription = (option: DemoOption): string | undefined =>
    option.description;
  protected readonly resolvePersonLabel = (value: string): string =>
    this.peopleOptions.find((person) => person.value === value)?.label ?? value;

  protected readonly filteredReviewerOptions = computed(() => {
    const query = this.reviewerQuery().toLowerCase().trim();
    if (query.length === 0) {
      return this.peopleOptions;
    }

    return this.peopleOptions.filter((person) => person.label.toLowerCase().includes(query));
  });
  protected readonly tailwindFilteredReviewerOptions = computed(() => {
    const query = this.tailwindReviewerQuery().toLowerCase().trim();
    if (query.length === 0) {
      return this.peopleOptions;
    }

    return this.peopleOptions.filter((person) => person.label.toLowerCase().includes(query));
  });

  protected readonly riskLabel = computed(() => {
    return this.formatRiskLabel(this.requestModel().riskTolerance);
  });
  protected readonly tailwindRiskLabel = computed(() =>
    this.formatRiskLabel(this.tailwindRequestModel().riskTolerance),
  );

  protected readonly preview = computed(() => JSON.stringify(this.requestModel(), null, 2));
  protected readonly tailwindPreview = computed(() =>
    JSON.stringify(this.tailwindRequestModel(), null, 2),
  );
  protected readonly submittedJson = signal<string | null>(null);
  protected readonly tailwindSubmittedJson = signal<string | null>(null);

  protected updateField<K extends keyof WorkspaceAccessRequest>(
    key: K,
    value: WorkspaceAccessRequest[K],
  ): void {
    this.updateRequestField(this.requestModel, key, value);
  }

  protected submitRequest(
    event: Event,
    model: WritableSignal<WorkspaceAccessRequest>,
    submittedJson: WritableSignal<string | null>,
  ): void {
    event.preventDefault();
    submittedJson.set(JSON.stringify(model(), null, 2));
  }

  protected updateRequestField<K extends keyof WorkspaceAccessRequest>(
    model: WritableSignal<WorkspaceAccessRequest>,
    key: K,
    value: WorkspaceAccessRequest[K],
  ): void {
    model.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  protected updateAccessType(
    model: WritableSignal<WorkspaceAccessRequest>,
    value: AccessType,
    checked: boolean,
  ): void {
    if (checked) {
      this.updateRequestField(model, 'accessType', value);
    }
  }

  protected updateEnvironment(model: WritableSignal<WorkspaceAccessRequest>, value: unknown): void {
    if (value === 'development' || value === 'staging' || value === 'production') {
      this.updateRequestField(model, 'environment', value);
    }
  }

  protected updatePriority(model: WritableSignal<WorkspaceAccessRequest>, value: unknown): void {
    if (value === 'low' || value === 'medium' || value === 'high' || value === 'critical') {
      this.updateRequestField(model, 'priority', value);
    }
  }

  protected normalizeBudgetYear(value: number | string | undefined): number | undefined {
    if (value === undefined) {
      return undefined;
    }

    const numericValue = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  protected updateAccessChannels(
    model: WritableSignal<WorkspaceAccessRequest>,
    value: unknown,
  ): void {
    if (Array.isArray(value)) {
      this.updateRequestField(
        model,
        'accessChannels',
        value.filter((item): item is string => typeof item === 'string'),
      );
    }
  }

  protected updateTags(
    model: WritableSignal<WorkspaceAccessRequest>,
    value: readonly unknown[],
  ): void {
    this.updateRequestField(
      model,
      'tags',
      value.filter((item): item is string => typeof item === 'string'),
    );
  }

  private formatRiskLabel(score: number): string {
    if (score >= 75) return 'High risk';
    if (score >= 40) return 'Moderate risk';
    return 'Low risk';
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
