import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessMenuDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessMenuDocSectionIds: readonly HeadlessMenuDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessMenuDocSection: HeadlessMenuDocSectionId = 'overview';

const headlessMenuOutlineItemsBySection: Readonly<
  Record<HeadlessMenuDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'keyboard-baseline', label: 'Keyboard baseline' },
  ],
  api: [
    { id: 'tng-menu', label: 'tngMenu' },
    { id: 'tng-menu-trigger', label: 'tngMenuTrigger' },
    { id: 'tng-menu-item', label: 'tngMenuItem' },
    { id: 'structure-backdrop', label: 'Structure & backdrop' },
    { id: 'events-token', label: 'Events & token' },
    { id: 'keyboard-contract', label: 'Keyboard contract' },
  ],
  styling: [
    { id: 'css-contract-table', label: 'CSS contract table' },
    { id: 'theme-tokens', label: 'Theme tokens' },
    { id: 'state-selectors', label: 'State selectors' },
  ],
  examples: [
    { id: 'dropdown-trigger', label: 'Dropdown with trigger' },
    { id: 'nested-submenu', label: 'Nested submenu' },
  ],
} as const;

function isHeadlessMenuDocSectionId(value: string): value is HeadlessMenuDocSectionId {
  return headlessMenuDocSectionIds.includes(value as HeadlessMenuDocSectionId);
}

@Component({
  selector: 'app-headless-menu-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './menu-page.component.html',
})
export class HeadlessMenuPageComponent {
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

  public readonly activeSection = computed<HeadlessMenuDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessMenuDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessMenuOutlineItemsBySection[this.activeSection()];
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
    return `Headless menu ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isHeadlessMenuDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): HeadlessMenuDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessMenuDocSectionId(section)) {
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
