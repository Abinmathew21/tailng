import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessToggleDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessToggleDocSectionIds: readonly HeadlessToggleDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessToggleDocSection: HeadlessToggleDocSectionId = 'overview';

const headlessToggleOutlineItemsBySection: Readonly<
  Record<HeadlessToggleDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'grouped-usage', label: 'Grouped usage' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'tng-toggle', label: 'tngToggle' },
    { id: 'tng-toggle-group', label: 'tngToggleGroup' },
    { id: 'reflected-attributes', label: 'Reflected attributes' },
    { id: 'change-handling', label: 'Change handling' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'example-shells', label: 'Example shells' },
  ],
  examples: [
    { id: 'standalone-formatting', label: 'Standalone formatting' },
    { id: 'view-mode-selection', label: 'View mode selection' },
    { id: 'disabled-fallbacks', label: 'Disabled fallbacks' },
  ],
} as const;

function isHeadlessToggleDocSectionId(value: string): value is HeadlessToggleDocSectionId {
  return headlessToggleDocSectionIds.includes(value as HeadlessToggleDocSectionId);
}

@Component({
  selector: 'app-headless-toggle-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './toggle-page.component.html',
})
export class HeadlessTogglePageComponent {
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

  public readonly activeSection = computed<HeadlessToggleDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessToggleDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessToggleOutlineItemsBySection[this.activeSection()];
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
    return `Headless toggle ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isHeadlessToggleDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): HeadlessToggleDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessToggleDocSectionId(section)) {
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
