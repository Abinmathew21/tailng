import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngInputOtpComponent, TngCodeBlockComponent } from '@tailng-ui/components';
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

const STYLING_GUIDE_CODE = String.raw`.project-otp-shell {
  --tng-semantic-background-surface: #ffffff;
  --tng-semantic-background-muted: #eef4ff;
  --tng-semantic-border-default: #cbd5e1;
  --tng-semantic-foreground-primary: #0f172a;
  --tng-semantic-foreground-muted: #94a3b8;
  --tng-semantic-accent-brand: #2563eb;
  --tng-semantic-accent-danger: #dc2626;
}`;

const PLAIN_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-styling-plain-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-styling-plain-example.component.html',
  styleUrl: './component-input-otp-styling-plain-example.component.css',
})
export class ComponentInputOtpStylingPlainExampleComponent {
  readonly componentInputOtpStylingPlainValue = signal('37');

  onComponentInputOtpStylingPlainValueChange(nextValue: string): void {
    this.componentInputOtpStylingPlainValue.set(nextValue);
  }
}`;

const PLAIN_HTML_CODE = String.raw`<section class="docs-component-input-otp-styling-plain-shell">
  <div class="docs-component-input-otp-styling-plain-header">
    <span class="docs-component-input-otp-styling-plain-kicker">Review code</span>
    <p class="docs-component-input-otp-styling-plain-copy">
      The wrapper keeps the OTP behavior stable while your host class supplies the visual theme.
    </p>
  </div>

  <tng-input-otp
    class="docs-component-input-otp-styling-plain-control"
    [length]="6"
    [value]="componentInputOtpStylingPlainValue()"
    [ariaLabel]="'Review code'"
    (valueChange)="onComponentInputOtpStylingPlainValueChange($event)"
  ></tng-input-otp>
</section>`;

const PLAIN_CSS_CODE = String.raw`.docs-component-input-otp-styling-plain-shell {
  display: grid;
  gap: 0.9rem;
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding: 1.15rem;
  border: 1px solid #d6c6b8;
  border-radius: 1.35rem;
  background: linear-gradient(180deg, #fff8ef 0%, #fffdf7 100%);
  color: #3f3022;
  color-scheme: light;
  box-shadow: 0 16px 40px rgba(68, 46, 14, 0.12);
}

.docs-component-input-otp-styling-plain-header {
  display: grid;
  gap: 0.35rem;
}

.docs-component-input-otp-styling-plain-kicker {
  color: #8a6d4f;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.docs-component-input-otp-styling-plain-copy {
  margin: 0;
  color: #5f4a35;
}

.docs-component-input-otp-styling-plain-control {
  --tng-semantic-background-surface: #fffdf7;
  --tng-semantic-background-muted: #fff1db;
  --tng-semantic-border-default: #d6c6b8;
  --tng-semantic-foreground-primary: #3f3022;
  --tng-semantic-foreground-muted: #9c8468;
  --tng-semantic-accent-brand: #c87817;
  --tng-semantic-accent-danger: #b42318;
}`;

const TAILWIND_TS_CODE = String.raw`import { Component, signal } from '@angular/core';
import { TngInputOtpComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-component-input-otp-styling-tailwind-example',
  standalone: true,
  imports: [TngInputOtpComponent],
  templateUrl: './component-input-otp-styling-tailwind-example.component.html',
  styleUrl: './component-input-otp-styling-tailwind-example.component.css',
})
export class ComponentInputOtpStylingTailwindExampleComponent {
  readonly componentInputOtpStylingTailwindValue = signal('58');

  onComponentInputOtpStylingTailwindValueChange(nextValue: string): void {
    this.componentInputOtpStylingTailwindValue.set(nextValue);
  }
}`;

const TAILWIND_HTML_CODE = String.raw`<section class="mx-auto grid w-full max-w-[36rem] gap-4 rounded-[1.75rem] border border-emerald-200 bg-white p-5 text-slate-900 shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
  <div class="grid gap-1">
    <span class="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">Payment approval</span>
    <p class="m-0 text-sm leading-6 text-slate-600">
      Apply semantic tokens directly on the wrapper host while keeping the OTP behavior untouched.
    </p>
  </div>

  <tng-input-otp
    class="block [--tng-semantic-background-surface:#ffffff] [--tng-semantic-background-muted:#ecfdf5] [--tng-semantic-border-default:#a7f3d0] [--tng-semantic-foreground-primary:#0f172a] [--tng-semantic-foreground-muted:#64748b] [--tng-semantic-accent-brand:#059669] [--tng-semantic-accent-danger:#dc2626]"
    [length]="6"
    [value]="componentInputOtpStylingTailwindValue()"
    [ariaLabel]="'Payment approval code'"
    (valueChange)="onComponentInputOtpStylingTailwindValueChange($event)"
  ></tng-input-otp>
</section>`;

@Component({
  selector: 'app-input-otp-styling-page',
  imports: [
    TngCodeBlockComponent,
    TngInputOtpComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './input-otp-styling-page.component.html',
  styleUrl: './input-otp-styling-page.component.css',
})
export class InputOtpStylingPageComponent implements OnDestroy {
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
  protected readonly stylingGuideCode = STYLING_GUIDE_CODE;
  protected readonly plainValue = signal('37');
  protected readonly tailwindValue = signal('58');

  protected readonly plainCodeTabs = createCodeTabs(
    'component-input-otp-styling-plain-example',
    PLAIN_TS_CODE,
    PLAIN_HTML_CODE,
    PLAIN_CSS_CODE,
  );
  protected readonly tailwindCodeTabs = createCodeTabs(
    'component-input-otp-styling-tailwind-example',
    TAILWIND_TS_CODE,
    TAILWIND_HTML_CODE,
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected onPlainValueChange(nextValue: string): void {
    this.plainValue.set(nextValue);
  }

  protected onTailwindValueChange(nextValue: string): void {
    this.tailwindValue.set(nextValue);
  }

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
