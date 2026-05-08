import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FormField, form, pattern as patternValidator, required } from '@angular/forms/signals';
import {
  TngAutocompleteComponent,
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
  TngFormFieldComponent,
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
import { TngChip, TngChipRemove } from '@tailng-ui/primitives';
import { map } from 'rxjs/operators';
import {
  COMPONENTS_GETTING_STARTED_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

type AccessType = 'temporary' | 'permanent';
type Environment = 'development' | 'staging' | 'production';
type Priority = 'low' | 'medium' | 'high' | 'critical';

type DemoOption = Readonly<{
  value: string;
  label: string;
  description?: string;
}>;

type WorkspaceAccessRequest = Readonly<{
  requestTitle: string;
  requesterEmail: string;
  verificationCode: string;
  department: string | null;
  managerId: string | null;
  reviewers: readonly string[];
  requestedApps: readonly string[];
  accessChannels: readonly string[];
  accessType: AccessType;
  environment: Environment;
  priority: Priority;
  startDate: Date | null;
  endDate: Date | null;
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
  { value: 'sso', label: 'SSO', description: 'Browser-based access through the identity provider.' },
  { value: 'vpn', label: 'VPN', description: 'Network-level access for private services.' },
  { value: 'api', label: 'API token', description: 'Machine access for integrations.' },
  { value: 'ssh', label: 'SSH', description: 'Shell access for infrastructure tasks.' },
];

const initialRequest: WorkspaceAccessRequest = {
  requestTitle: 'Production observability access',
  requesterEmail: 'prince@example.com',
  verificationCode: '123456',
  department: 'engineering',
  managerId: 'maya',
  reviewers: ['maya', 'sofia'],
  requestedApps: ['github', 'datadog'],
  accessChannels: ['sso', 'api'],
  accessType: 'temporary',
  environment: 'production',
  priority: 'high',
  startDate: new Date(2026, 4, 12),
  endDate: new Date(2026, 4, 26),
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

@Component({
  selector: 'app-signal-form-demo-page',
  imports: [
    FormField,
    TngAutocompleteComponent,
    TngButtonToggleComponent,
    TngButtonToggleGroupComponent,
    TngCardComponent,
    TngCardContentComponent,
    TngCardDescriptionComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCheckboxComponent,
    TngChipsComponent,
    TngChip,
    TngChipRemove,
    TngDatepickerComponent,
    TngFormFieldComponent,
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
  ],
  templateUrl: './signal-form-demo-page.component.html',
  styleUrl: './signal-form-demo-page.component.css',
})
export class SignalFormDemoPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  protected readonly item = computed(() => this.routeData().item);
  protected readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly requestModel = signal<WorkspaceAccessRequest>(initialRequest);
  protected readonly requestForm = form(this.requestModel, (request) => {
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

  protected readonly riskLabel = computed(() => {
    const score = this.requestModel().riskTolerance;
    if (score >= 75) return 'High risk';
    if (score >= 40) return 'Moderate risk';
    return 'Low risk';
  });

  protected readonly preview = computed(() =>
    JSON.stringify(this.requestModel(), null, 2),
  );

  protected updateField<K extends keyof WorkspaceAccessRequest>(
    key: K,
    value: WorkspaceAccessRequest[K],
  ): void {
    this.requestModel.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  protected updateAccessType(value: AccessType, checked: boolean): void {
    if (checked) {
      this.updateField('accessType', value);
    }
  }

  protected updateEnvironment(value: unknown): void {
    if (value === 'development' || value === 'staging' || value === 'production') {
      this.updateField('environment', value);
    }
  }

  protected updatePriority(value: unknown): void {
    if (value === 'low' || value === 'medium' || value === 'high' || value === 'critical') {
      this.updateField('priority', value);
    }
  }

  protected updateAccessChannels(value: unknown): void {
    if (Array.isArray(value)) {
      this.updateField('accessChannels', value.filter((item): item is string => typeof item === 'string'));
    }
  }

  protected updateDateField(
    key: 'endDate' | 'startDate',
    value: Date | readonly Date[] | null,
  ): void {
    this.updateField(key, value instanceof Date ? value : null);
  }

  protected updateTags(value: readonly unknown[]): void {
    this.updateField('tags', value.filter((item): item is string => typeof item === 'string'));
  }
}
