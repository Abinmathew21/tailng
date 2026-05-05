import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessProgressSpinnerDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessProgressSpinnerDocSectionIds: readonly HeadlessProgressSpinnerDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessProgressSpinnerDocSection: HeadlessProgressSpinnerDocSectionId = 'overview';

const headlessProgressSpinnerOutlineItemsBySection: Readonly<
  Record<HeadlessProgressSpinnerDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'range-semantics', label: 'Range semantics' },
  ],
  api: [
    { id: 'root-directive', label: 'Root directive' },
    { id: 'svg-foundation', label: 'SVG foundation' },
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

function isHeadlessProgressSpinnerDocSectionId(
  value: string,
): value is HeadlessProgressSpinnerDocSectionId {
  return headlessProgressSpinnerDocSectionIds.includes(
    value as HeadlessProgressSpinnerDocSectionId,
  );
}

@Component({
  selector: 'app-headless-progress-spinner-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './progress-spinner-page.component.html',
})
export class HeadlessProgressSpinnerPageComponent {
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

  public readonly activeSection = computed<HeadlessProgressSpinnerDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessProgressSpinnerDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessProgressSpinnerOutlineItemsBySection[this.activeSection()];
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
    return `Headless progress spinner ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessProgressSpinnerDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessProgressSpinnerDocSectionId(section)) {
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
