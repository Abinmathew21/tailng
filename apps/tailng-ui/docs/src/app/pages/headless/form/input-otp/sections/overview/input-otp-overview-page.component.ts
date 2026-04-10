import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

const PRIMITIVE_IMPORT_CODE = String.raw`import {
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';`;

const USAGE_BASELINE_CODE = String.raw`<div
  tngInputOtp
  [length]="6"
  [value]="verificationCode()"
  (valueChange)="verificationCode.set($event)"
  [activeIndex]="activeIndex()"
  (activeIndexChange)="activeIndex.set($event)"
>
  @for (slotIndex of verificationSlotIndexes; track slotIndex) {
    <input [tngInputOtpSlot]="slotIndex" maxlength="1" inputmode="numeric" />
  }
</div>`;

const PLAIN_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-overview-plain-example',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-overview-plain-example.component.html',
  styleUrl: './headless-input-otp-overview-plain-example.component.css',
})
export class HeadlessInputOtpOverviewPlainExampleComponent {
  readonly headlessInputOtpOverviewPlainLength = 6;
  readonly headlessInputOtpOverviewPlainSlotIndexes = Array.from(
    { length: this.headlessInputOtpOverviewPlainLength },
    (_, index) => index,
  );
  readonly headlessInputOtpOverviewPlainValue = signal('18');
  readonly headlessInputOtpOverviewPlainActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpOverviewPlainState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpOverviewPlainLength,
      this.headlessInputOtpOverviewPlainValue(),
    ),
  );
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-input-otp-overview-plain-shell">
  <div class="docs-headless-input-otp-overview-plain-header">
    <span class="docs-headless-input-otp-overview-plain-kicker">Verification code</span>
    <p class="docs-headless-input-otp-overview-plain-copy">
      Own the slot markup directly while the primitive coordinates value and focus movement.
    </p>
  </div>

  <div
    tngInputOtp
    class="docs-headless-input-otp-overview-plain-root"
    [length]="headlessInputOtpOverviewPlainLength"
    [value]="headlessInputOtpOverviewPlainValue()"
    (valueChange)="headlessInputOtpOverviewPlainValue.set($event)"
    [activeIndex]="headlessInputOtpOverviewPlainActiveIndex()"
    (activeIndexChange)="headlessInputOtpOverviewPlainActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpOverviewPlainSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="docs-headless-input-otp-overview-plain-slot"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="docs-headless-input-otp-overview-plain-summary">Value: {{ headlessInputOtpOverviewPlainValue() || '—' }}</p>
  <p class="docs-headless-input-otp-overview-plain-summary">State: {{ headlessInputOtpOverviewPlainState() }}</p>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-input-otp-overview-plain-shell {
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

.docs-headless-input-otp-overview-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-headless-input-otp-overview-plain-kicker {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-headless-input-otp-overview-plain-copy,
.docs-headless-input-otp-overview-plain-summary {
  margin: 0;
  color: #475569;
}

.docs-headless-input-otp-overview-plain-root[data-slot='input-otp'] {
  display: inline-flex;
  gap: 0.55rem;
}

.docs-headless-input-otp-overview-plain-slot {
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
}

.docs-headless-input-otp-overview-plain-root[data-slot='input-otp'][data-active='2'] .docs-headless-input-otp-overview-plain-slot[data-tng-otp-slot='2'] {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
  outline: none;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, computed, signal } from '@angular/core';
import {
  resolveTngOtpState,
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';

@Component({
  selector: 'app-headless-input-otp-overview-tailwind-example',
  standalone: true,
  imports: [TngInputOtpPrimitive, TngInputOtpSlot],
  templateUrl: './headless-input-otp-overview-tailwind-example.component.html',
  styleUrl: './headless-input-otp-overview-tailwind-example.component.css',
})
export class HeadlessInputOtpOverviewTailwindExampleComponent {
  readonly headlessInputOtpOverviewTailwindLength = 6;
  readonly headlessInputOtpOverviewTailwindSlotIndexes = Array.from(
    { length: this.headlessInputOtpOverviewTailwindLength },
    (_, index) => index,
  );
  readonly headlessInputOtpOverviewTailwindValue = signal('40');
  readonly headlessInputOtpOverviewTailwindActiveIndex = signal<number | null>(2);
  readonly headlessInputOtpOverviewTailwindState = computed(() =>
    resolveTngOtpState(
      this.headlessInputOtpOverviewTailwindLength,
      this.headlessInputOtpOverviewTailwindValue(),
    ),
  );
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Approval code</span>
    <p class="m-0 text-sm leading-6 text-slate-600">
      Same primitive contract, utility-first shell, and fully owned slot markup.
    </p>
  </div>

  <div
    tngInputOtp
    class="flex gap-2"
    [length]="headlessInputOtpOverviewTailwindLength"
    [value]="headlessInputOtpOverviewTailwindValue()"
    (valueChange)="headlessInputOtpOverviewTailwindValue.set($event)"
    [activeIndex]="headlessInputOtpOverviewTailwindActiveIndex()"
    (activeIndexChange)="headlessInputOtpOverviewTailwindActiveIndex.set($event)"
  >
    @for (slotIndex of headlessInputOtpOverviewTailwindSlotIndexes; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="h-11 w-10 rounded-xl border border-slate-300 bg-white text-center text-base font-semibold text-slate-900 outline-none transition data-[active=true]:border-blue-500"
        [class.border-blue-500]="headlessInputOtpOverviewTailwindActiveIndex() === slotIndex"
        [class.ring-4]="headlessInputOtpOverviewTailwindActiveIndex() === slotIndex"
        [class.ring-blue-100]="headlessInputOtpOverviewTailwindActiveIndex() === slotIndex"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>

  <p class="m-0 text-sm text-slate-600">Value: {{ headlessInputOtpOverviewTailwindValue() || '—' }}</p>
  <p class="m-0 text-sm text-slate-600">State: {{ headlessInputOtpOverviewTailwindState() }}</p>
</section>`;

@Component({
  selector: 'app-headless-input-otp-overview-page',
  imports: [
    TngCodeBlockComponent,
    TngInputOtpPrimitive,
    TngInputOtpSlot,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-overview-page.component.html',
  styleUrl: './input-otp-overview-page.component.css',
})
export class HeadlessInputOtpOverviewPageComponent implements OnDestroy {
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
  protected readonly primitiveImportCode = PRIMITIVE_IMPORT_CODE;
  protected readonly usageBaselineCode = USAGE_BASELINE_CODE;

  protected readonly plainLength = 6;
  protected readonly plainSlotIndexes = Array.from({ length: this.plainLength }, (_, index) => index);
  protected readonly plainValue = signal('18');
  protected readonly plainActiveIndex = signal<number | null>(2);
  protected readonly tailwindLength = 6;
  protected readonly tailwindSlotIndexes = Array.from(
    { length: this.tailwindLength },
    (_, index) => index,
  );
  protected readonly tailwindValue = signal('40');
  protected readonly tailwindActiveIndex = signal<number | null>(2);

  protected readonly plainState = computed(() => resolveTngOtpState(this.plainLength, this.plainValue()));
  protected readonly tailwindState = computed(() =>
    resolveTngOtpState(this.tailwindLength, this.tailwindValue()),
  );

  protected readonly plainCodeTabs = createCodeTabs(
    'headless-input-otp-overview-plain-example',
    PLAIN_TS_CODE,
    PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-input-otp-overview-tailwind-example',
    TAILWIND_TS_CODE,
    TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
