import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessProgressBarDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessProgressBarDocSectionIds: readonly HeadlessProgressBarDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessProgressBarDocSection: HeadlessProgressBarDocSectionId = 'overview';

const headlessProgressBarOutlineItemsBySection: Readonly<
  Record<HeadlessProgressBarDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'range-semantics', label: 'Range semantics' },
  ],
  api: [
    { id: 'root-directive', label: 'Root directive' },
    { id: 'indicator-directive', label: 'Indicator directive' },
    { id: 'accessibility-contract', label: 'Accessibility contract' },
  ],
  styling: [
    { id: 'slot-hooks', label: 'Slot hooks' },
    { id: 'css-starter', label: 'CSS starter' },
    { id: 'motion-guidance', label: 'Motion guidance' },
  ],
  examples: [
    { id: 'determinate-metrics', label: 'Determinate metrics' },
    { id: 'indeterminate-handoff', label: 'Indeterminate handoff' },
  ],
} as const;

function isHeadlessProgressBarDocSectionId(
  value: string,
): value is HeadlessProgressBarDocSectionId {
  return headlessProgressBarDocSectionIds.includes(value as HeadlessProgressBarDocSectionId);
}

@Component({
  selector: 'app-headless-progress-bar-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './progress-bar-page.component.html',
})
export class HeadlessProgressBarPageComponent {
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

  public readonly activeSection = computed<HeadlessProgressBarDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessProgressBarDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessProgressBarOutlineItemsBySection[this.activeSection()];
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
    return `Headless progress bar ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isHeadlessProgressBarDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): HeadlessProgressBarDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessProgressBarDocSectionId(section)) {
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
