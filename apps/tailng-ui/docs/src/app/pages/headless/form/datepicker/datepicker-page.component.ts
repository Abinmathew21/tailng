import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessDatepickerDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessDatepickerDocSectionIds: readonly HeadlessDatepickerDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessDatepickerDocSection: HeadlessDatepickerDocSectionId = 'overview';

const headlessDatepickerOutlineItemsBySection: Readonly<
  Record<HeadlessDatepickerDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'usage-baseline', label: 'Usage baseline' },
    { id: 'datepicker-variants', label: 'Datepicker variants' },
    { id: 'behavior-baseline', label: 'Behavior baseline' },
  ],
  api: [
    { id: 'createdatepickercontroller', label: 'createDatepickerController' },
    { id: 'tngdatepickeroverlay', label: 'tngDatepickerOverlay' },
    { id: 'slot-outputs', label: 'Slot outputs' },
    { id: 'controller-methods', label: 'Controller methods' },
  ],
  styling: [
    { id: 'css-contract-table', label: 'CSS contract table' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'common-custom-properties', label: 'Common custom properties' },
  ],
  examples: [
    { id: 'booking-window', label: 'Booking window' },
    { id: 'reporting-calendar', label: 'Reporting calendar' },
  ],
} as const;

function isHeadlessDatepickerDocSectionId(
  value: string,
): value is HeadlessDatepickerDocSectionId {
  return headlessDatepickerDocSectionIds.includes(value as HeadlessDatepickerDocSectionId);
}

@Component({
  selector: 'app-headless-datepicker-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './datepicker-page.component.html',
})
export class HeadlessDatepickerPageComponent {
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

  public readonly activeSection = computed<HeadlessDatepickerDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessDatepickerDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessDatepickerOutlineItemsBySection[this.activeSection()];
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
    return `Headless datepicker ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessDatepickerDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessDatepickerDocSectionId(section)) {
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
