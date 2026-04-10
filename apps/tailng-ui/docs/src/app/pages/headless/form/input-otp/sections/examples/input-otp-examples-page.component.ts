import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
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
import { stackblitzTailwindUrl, stackblitzVanillaUrl } from '../../input-otp.util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

const SMS_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-examples-sms-plain',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-examples-sms-plain.component.html',
  styleUrl: './headless-input-otp-examples-sms-plain.component.css',
})
export class HeadlessInputOtpExamplesSmsPlainComponent {
  readonly headlessInputOtpExamplesSmsPlainLength = 6;
  readonly headlessInputOtpExamplesSmsPlainSlotIndexes = Array.from(
    { length: this.headlessInputOtpExamplesSmsPlainLength },
    (_, index) => index,
  );
  readonly headlessInputOtpExamplesSmsPlainValue = signal('73');
  readonly headlessInputOtpExamplesSmsPlainActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpExamplesSmsPlainState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpExamplesSmsPlainLength,
      this.headlessInputOtpExamplesSmsPlainValue(),
    ),
  );
}`;

const SMS_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-input-otp-examples-sms-plain-shell">
  <div class="docs-headless-input-otp-examples-sms-plain-header">
    <span class="docs-headless-input-otp-examples-sms-plain-kicker">SMS verification</span>
    <p class="docs-headless-input-otp-examples-sms-plain-copy">
      A lightweight owned OTP row for a simple SMS verification step.
    </p>
  </div>

  <div
    tngInputOtp
    class="docs-headless-input-otp-examples-sms-plain-root"
    [length]="headlessInputOtpExamplesSmsPlainLength"
    [value]="headlessInputOtpExamplesSmsPlainValue()"
    (valueChange)="headlessInputOtpExamplesSmsPlainValue.set($event)"
    [activeIndex]="headlessInputOtpExamplesSmsPlainActiveIndex()"
    (activeIndexChange)="headlessInputOtpExamplesSmsPlainActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpExamplesSmsPlainSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="docs-headless-input-otp-examples-sms-plain-slot"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="docs-headless-input-otp-examples-sms-plain-summary">Value: {{ headlessInputOtpExamplesSmsPlainValue() || '—' }}</p>
  <p class="docs-headless-input-otp-examples-sms-plain-summary">State: {{ headlessInputOtpExamplesSmsPlainState() }}</p>
</section>`;

const SMS_PLAIN_CSS_CODE = String.raw`.docs-headless-input-otp-examples-sms-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.35rem;
  background: #ffffff;
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.docs-headless-input-otp-examples-sms-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-input-otp-examples-sms-plain-kicker {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-headless-input-otp-examples-sms-plain-copy,
.docs-headless-input-otp-examples-sms-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-input-otp-examples-sms-plain-root[data-slot='input-otp'] {
  display: inline-flex;
  gap: 0.55rem;
}

.docs-headless-input-otp-examples-sms-plain-slot {
  appearance: none;
  inline-size: 2.55rem;
  block-size: 2.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  background: #ffffff;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.docs-headless-input-otp-examples-sms-plain-slot:focus-visible {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}
`;

const SMS_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-examples-sms-tailwind',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-examples-sms-tailwind.component.html',
  styleUrl: './headless-input-otp-examples-sms-tailwind.component.css',
})
export class HeadlessInputOtpExamplesSmsTailwindComponent {
  readonly headlessInputOtpExamplesSmsTailwindLength = 6;
  readonly headlessInputOtpExamplesSmsTailwindSlotIndexes = Array.from(
    { length: this.headlessInputOtpExamplesSmsTailwindLength },
    (_, index) => index,
  );
  readonly headlessInputOtpExamplesSmsTailwindValue = signal('73');
  readonly headlessInputOtpExamplesSmsTailwindActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpExamplesSmsTailwindState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpExamplesSmsTailwindLength,
      this.headlessInputOtpExamplesSmsTailwindValue(),
    ),
  );
}`;

const SMS_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-blue-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">SMS verification</span>
    <p class="m-0 text-sm leading-6 text-slate-600">
      A utility-first OTP row for a lightweight verification step.
    </p>
  </div>

  <div
    tngInputOtp
    class="flex gap-2"
    [length]="headlessInputOtpExamplesSmsTailwindLength"
    [value]="headlessInputOtpExamplesSmsTailwindValue()"
    (valueChange)="headlessInputOtpExamplesSmsTailwindValue.set($event)"
    [activeIndex]="headlessInputOtpExamplesSmsTailwindActiveIndex()"
    (activeIndexChange)="headlessInputOtpExamplesSmsTailwindActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpExamplesSmsTailwindSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="h-11 w-10 rounded-xl border border-slate-300 bg-white text-center text-base font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="m-0 text-sm text-slate-600">Value: {{ headlessInputOtpExamplesSmsTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-slate-600">State: {{ headlessInputOtpExamplesSmsTailwindState() }}</p>
</section>`;

const RECOVERY_PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-examples-recovery-plain',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-examples-recovery-plain.component.html',
  styleUrl: './headless-input-otp-examples-recovery-plain.component.css',
})
export class HeadlessInputOtpExamplesRecoveryPlainComponent {
  readonly headlessInputOtpExamplesRecoveryPlainLength = 6;
  readonly headlessInputOtpExamplesRecoveryPlainSlotIndexes = Array.from(
    { length: this.headlessInputOtpExamplesRecoveryPlainLength },
    (_, index) => index,
  );
  readonly headlessInputOtpExamplesRecoveryPlainValue = signal('91');
  readonly headlessInputOtpExamplesRecoveryPlainActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpExamplesRecoveryPlainState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpExamplesRecoveryPlainLength,
      this.headlessInputOtpExamplesRecoveryPlainValue(),
    ),
  );
}`;

const RECOVERY_PLAIN_HTML_CODE = String.raw`<section class="docs-headless-input-otp-examples-recovery-plain-shell">
  <div class="docs-headless-input-otp-examples-recovery-plain-header">
    <span class="docs-headless-input-otp-examples-recovery-plain-kicker">Recovery checkpoint</span>
    <p class="docs-headless-input-otp-examples-recovery-plain-copy">
      A softer approval shell that still keeps the slot markup fully owned.
    </p>
  </div>

  <div
    tngInputOtp
    class="docs-headless-input-otp-examples-recovery-plain-root"
    [length]="headlessInputOtpExamplesRecoveryPlainLength"
    [value]="headlessInputOtpExamplesRecoveryPlainValue()"
    (valueChange)="headlessInputOtpExamplesRecoveryPlainValue.set($event)"
    [activeIndex]="headlessInputOtpExamplesRecoveryPlainActiveIndex()"
    (activeIndexChange)="headlessInputOtpExamplesRecoveryPlainActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpExamplesRecoveryPlainSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="docs-headless-input-otp-examples-recovery-plain-slot"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="docs-headless-input-otp-examples-recovery-plain-summary">Value: {{ headlessInputOtpExamplesRecoveryPlainValue() || '—' }}</p>
  <p class="docs-headless-input-otp-examples-recovery-plain-summary">State: {{ headlessInputOtpExamplesRecoveryPlainState() }}</p>
</section>`;

const RECOVERY_PLAIN_CSS_CODE = String.raw`.docs-headless-input-otp-examples-recovery-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.2rem;
  border: 1px solid #b7e4d7;
  border-radius: 1.45rem;
  background: linear-gradient(180deg, #ffffff 0%, #f7fcfa 100%);
  color: #0f172a;
  color-scheme: light;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
}

.docs-headless-input-otp-examples-recovery-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-input-otp-examples-recovery-plain-kicker {
  color: #0f766e;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-headless-input-otp-examples-recovery-plain-copy,
.docs-headless-input-otp-examples-recovery-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-input-otp-examples-recovery-plain-root[data-slot='input-otp'] {
  display: inline-flex;
  gap: 0.55rem;
}

.docs-headless-input-otp-examples-recovery-plain-slot {
  appearance: none;
  inline-size: 2.6rem;
  block-size: 2.85rem;
  border: 1px solid #99f6e4;
  border-radius: 0.85rem;
  background: #ffffff;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.docs-headless-input-otp-examples-recovery-plain-slot:focus-visible {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.16);
}
`;

const RECOVERY_TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-examples-recovery-tailwind',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-examples-recovery-tailwind.component.html',
  styleUrl: './headless-input-otp-examples-recovery-tailwind.component.css',
})
export class HeadlessInputOtpExamplesRecoveryTailwindComponent {
  readonly headlessInputOtpExamplesRecoveryTailwindLength = 6;
  readonly headlessInputOtpExamplesRecoveryTailwindSlotIndexes = Array.from(
    { length: this.headlessInputOtpExamplesRecoveryTailwindLength },
    (_, index) => index,
  );
  readonly headlessInputOtpExamplesRecoveryTailwindValue = signal('91');
  readonly headlessInputOtpExamplesRecoveryTailwindActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpExamplesRecoveryTailwindState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpExamplesRecoveryTailwindLength,
      this.headlessInputOtpExamplesRecoveryTailwindValue(),
    ),
  );
}`;

const RECOVERY_TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-emerald-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Recovery checkpoint</span>
    <p class="m-0 text-sm leading-6 text-slate-600">A utility-first approval surface with fully owned OTP slots.</p>
  </div>

  <div
    tngInputOtp
    class="flex gap-2"
    [length]="headlessInputOtpExamplesRecoveryTailwindLength"
    [value]="headlessInputOtpExamplesRecoveryTailwindValue()"
    (valueChange)="headlessInputOtpExamplesRecoveryTailwindValue.set($event)"
    [activeIndex]="headlessInputOtpExamplesRecoveryTailwindActiveIndex()"
    (activeIndexChange)="headlessInputOtpExamplesRecoveryTailwindActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpExamplesRecoveryTailwindSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="h-11 w-10 rounded-xl border border-slate-300 bg-white text-center text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="m-0 text-sm text-slate-600">Value: {{ headlessInputOtpExamplesRecoveryTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-slate-600">State: {{ headlessInputOtpExamplesRecoveryTailwindState() }}</p>
</section>`;

@Component({
  selector: 'app-headless-input-otp-examples-page',
  imports: [
    TngInputOtpPrimitive,
    TngInputOtpSlot,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-examples-page.component.html',
  styleUrl: './input-otp-examples-page.component.css',
})
export class HeadlessInputOtpExamplesPageComponent implements OnDestroy {
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

  protected readonly smsPlainLength = 6;
  protected readonly smsPlainSlotIndexes = Array.from(
    { length: this.smsPlainLength },
    (_, index) => index,
  );
  protected readonly smsPlainValue = signal('73');
  protected readonly smsPlainActiveIndex = signal<number | null>(2);
  protected readonly smsPlainState = computed(() =>
    resolveTngOtpState(this.smsPlainLength, this.smsPlainValue()),
  );

  protected readonly smsTailwindLength = 6;
  protected readonly smsTailwindSlotIndexes = Array.from(
    { length: this.smsTailwindLength },
    (_, index) => index,
  );
  protected readonly smsTailwindValue = signal('73');
  protected readonly smsTailwindActiveIndex = signal<number | null>(2);
  protected readonly smsTailwindState = computed(() =>
    resolveTngOtpState(this.smsTailwindLength, this.smsTailwindValue()),
  );

  protected readonly recoveryPlainLength = 6;
  protected readonly recoveryPlainSlotIndexes = Array.from(
    { length: this.recoveryPlainLength },
    (_, index) => index,
  );
  protected readonly recoveryPlainValue = signal('91');
  protected readonly recoveryPlainActiveIndex = signal<number | null>(2);
  protected readonly recoveryPlainState = computed(() =>
    resolveTngOtpState(this.recoveryPlainLength, this.recoveryPlainValue()),
  );

  protected readonly recoveryTailwindLength = 6;
  protected readonly recoveryTailwindSlotIndexes = Array.from(
    { length: this.recoveryTailwindLength },
    (_, index) => index,
  );
  protected readonly recoveryTailwindValue = signal('91');
  protected readonly recoveryTailwindActiveIndex = signal<number | null>(2);
  protected readonly recoveryTailwindState = computed(() =>
    resolveTngOtpState(this.recoveryTailwindLength, this.recoveryTailwindValue()),
  );

  protected readonly smsPlainCodeTabs = createCodeTabs(
    'headless-input-otp-examples-sms-plain',
    SMS_PLAIN_TS_CODE,
    SMS_PLAIN_HTML_CODE,
    SMS_PLAIN_CSS_CODE,
  );
  protected readonly smsTailwindCodeTabs = createCodeTabs(
    'headless-input-otp-examples-sms-tailwind',
    SMS_TAILWIND_TS_CODE,
    SMS_TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );
  protected readonly recoveryPlainCodeTabs = createCodeTabs(
    'headless-input-otp-examples-recovery-plain',
    RECOVERY_PLAIN_TS_CODE,
    RECOVERY_PLAIN_HTML_CODE,
    RECOVERY_PLAIN_CSS_CODE,
  );
  protected readonly recoveryTailwindCodeTabs = createCodeTabs(
    'headless-input-otp-examples-recovery-tailwind',
    RECOVERY_TAILWIND_TS_CODE,
    RECOVERY_TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
