import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';
import {
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

const CSS_CONTRACT_CODE = String.raw`[data-slot='input-otp'] { }
[data-empty] { }
[data-partial] { }
[data-complete] { }
[data-active='2'] { }
[data-focused] { }
[data-focus-visible] { }
[data-invalid] { }
[data-disabled] { }`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-headless-input-otp-styling-plain-shell">
  <div
    tngInputOtp
    class="docs-headless-input-otp-styling-plain-root"
    [length]="6"
    [value]="'2184'"
    [focused]="true"
    [focusVisible]="true"
  >
    @for (slotIndex of [0, 1, 2, 3, 4, 5]; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="docs-headless-input-otp-styling-plain-slot"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-headless-input-otp-styling-plain-shell {
  display: grid;
  place-items: center;
  padding: 1.15rem;
  border: 1px solid #cbd5e1;
  border-radius: 1.35rem;
  background: #ffffff;
  color-scheme: light;
}

.docs-headless-input-otp-styling-plain-root[data-slot='input-otp'] {
  display: inline-flex;
  gap: 0.55rem;
}

.docs-headless-input-otp-styling-plain-slot {
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

.docs-headless-input-otp-styling-plain-root[data-slot='input-otp'][data-active='4'] .docs-headless-input-otp-styling-plain-slot[data-tng-otp-slot='4'] {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
}

.docs-headless-input-otp-styling-plain-root[data-slot='input-otp'][data-partial] .docs-headless-input-otp-styling-plain-slot {
  background: #f8fbff;
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
  <div
    tngInputOtp
    class="flex gap-2"
    [length]="6"
    [value]="'5310'"
    [focused]="true"
    [focusVisible]="true"
  >
    @for (slotIndex of [0, 1, 2, 3, 4, 5]; track slotIndex) {
      <input
        [tngInputOtpSlot]="slotIndex"
        class="h-11 w-10 rounded-xl border border-slate-300 bg-white text-center text-base font-semibold text-slate-900 outline-none transition"
        [class.border-emerald-500]="slotIndex === 4"
        [class.ring-4]="slotIndex === 4"
        [class.ring-emerald-100]="slotIndex === 4"
        maxlength="1"
        inputmode="numeric"
      />
    }
  </div>
</section>`;

@Component({
  selector: 'app-headless-input-otp-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngInputOtpPrimitive,
    TngInputOtpSlot,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-styling-page.component.html',
  styleUrl: './input-otp-styling-page.component.css',
})
export class HeadlessInputOtpStylingPageComponent implements OnDestroy {
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
  protected readonly cssContractCode = CSS_CONTRACT_CODE;
  protected readonly plainCodeTabs = createCodeTabs(
    'headless-input-otp-styling-plain-example',
    `import {
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';`,
    PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'headless-input-otp-styling-tailwind-example',
    `import {
  TngInputOtp as TngInputOtpPrimitive,
  TngInputOtpSlot,
} from '@tailng-ui/primitives';`,
    TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
