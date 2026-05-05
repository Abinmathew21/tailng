import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessMultiAutocompleteDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessMultiAutocompleteDocSectionIds: readonly HeadlessMultiAutocompleteDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessMultiAutocompleteDocSection: HeadlessMultiAutocompleteDocSectionId = 'overview';

const headlessMultiAutocompleteOutlineItemsBySection: Readonly<
  Record<HeadlessMultiAutocompleteDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'tngmultiautocomplete', label: 'tngMultiAutocomplete' },
    { id: 'owned-parts', label: 'Owned parts' },
    { id: 'models-and-events', label: 'Models and events' },
    { id: 'reflected-attributes', label: 'Reflected attributes' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'wrapper-shell-examples', label: 'Wrapper shell examples' },
  ],
  examples: [
    { id: 'launch-market-picker', label: 'Launch market picker' },
    { id: 'release-owner-roster', label: 'Release owner roster' },
  ],
} as const;

function isHeadlessMultiAutocompleteDocSectionId(
  value: string,
): value is HeadlessMultiAutocompleteDocSectionId {
  return headlessMultiAutocompleteDocSectionIds.includes(
    value as HeadlessMultiAutocompleteDocSectionId,
  );
}

@Component({
  selector: 'app-headless-multi-autocomplete-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './multi-autocomplete-page.component.html',
})
export class HeadlessMultiAutocompletePageComponent {
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

  public readonly activeSection = computed<HeadlessMultiAutocompleteDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessMultiAutocompleteDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessMultiAutocompleteOutlineItemsBySection[this.activeSection()];
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
    return `Headless multi autocomplete ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessMultiAutocompleteDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessMultiAutocompleteDocSectionId(section)) {
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
