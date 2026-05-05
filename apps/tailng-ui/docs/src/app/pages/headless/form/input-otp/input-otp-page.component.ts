import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessInputOtpDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessInputOtpDocSectionIds: readonly HeadlessInputOtpDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessInputOtpDocSection: HeadlessInputOtpDocSectionId = 'overview';

const headlessInputOtpOutlineItemsBySection: Readonly<
  Record<HeadlessInputOtpDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'usage-baseline', label: 'Usage baseline' },
    { id: 'otp-variants', label: 'OTP variants' },
    { id: 'behavior-baseline', label: 'Behavior baseline' },
  ],
  api: [
    { id: 'tnginputotp', label: 'tngInputOtp' },
    { id: 'reflected-state', label: 'Reflected state' },
    { id: 'ownership-notes', label: 'Ownership notes' },
  ],
  styling: [
    { id: 'css-contract-table', label: 'CSS contract table' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'styling-variants', label: 'Styling variants' },
  ],
  examples: [
    { id: 'sms-verification-code', label: 'SMS verification code' },
    { id: 'recovery-checkpoint', label: 'Recovery checkpoint' },
  ],
} as const;

function isHeadlessInputOtpDocSectionId(value: string): value is HeadlessInputOtpDocSectionId {
  return headlessInputOtpDocSectionIds.includes(value as HeadlessInputOtpDocSectionId);
}

@Component({
  selector: 'app-headless-input-otp-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './input-otp-page.component.html',
})
export class HeadlessInputOtpPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly activeSection = computed<HeadlessInputOtpDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessInputOtpDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessInputOtpOutlineItemsBySection[this.activeSection()];
  });
  public readonly outlineTitle = computed<string>(() => {
    switch (this.activeSection()) {
      case 'api':
        return 'API content';
      case 'styling':
        return 'Styling content';
      case 'examples':
        return 'Examples content';
      case 'overview':
      default:
        return 'Overview content';
    }
  });
  public readonly outlineAriaLabel = computed<string>(() => {
    return `Headless input OTP ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessInputOtpDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessInputOtpDocSectionId(section)) {
      return null;
    }

    return section;
  }

  private normalizeUrl(rawUrl: string): string {
    const queryIndex = rawUrl.indexOf('?');
    const hashIndex = rawUrl.indexOf('#');
    let endIndex = rawUrl.length;

    if (queryIndex >= 0) {
      endIndex = Math.min(endIndex, queryIndex);
    }

    if (hashIndex >= 0) {
      endIndex = Math.min(endIndex, hashIndex);
    }

    const normalized = rawUrl.slice(0, endIndex);
    if (normalized.length > 1 && normalized.endsWith('/')) {
      return normalized.slice(0, -1);
    }

    return normalized;
  }
}
