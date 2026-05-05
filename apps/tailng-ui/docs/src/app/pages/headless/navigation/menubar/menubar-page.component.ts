import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessMenubarDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessMenubarDocSectionIds: readonly HeadlessMenubarDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessMenubarDocSection: HeadlessMenubarDocSectionId = 'overview';

const headlessMenubarOutlineItemsBySection: Readonly<
  Record<HeadlessMenubarDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'keyboard-baseline', label: 'Keyboard baseline' },
  ],
  api: [
    { id: 'tng-menubar', label: 'tngMenubar' },
    { id: 'tng-menubar-item', label: 'tngMenubarItem' },
    { id: 'owned-menu-link', label: 'Owned menu link' },
    { id: 'keyboard-contract', label: 'Keyboard contract' },
  ],
  styling: [
    { id: 'css-contract-table', label: 'CSS contract table' },
    { id: 'theme-tokens', label: 'Theme tokens' },
    { id: 'state-selectors', label: 'State selectors' },
  ],
  examples: [
    { id: 'workspace-command-bar', label: 'Workspace command bar' },
    { id: 'cascaded-import-menu', label: 'Cascaded import menu' },
  ],
} as const;

function isHeadlessMenubarDocSectionId(value: string): value is HeadlessMenubarDocSectionId {
  return headlessMenubarDocSectionIds.includes(value as HeadlessMenubarDocSectionId);
}

@Component({
  selector: 'app-headless-menubar-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './menubar-page.component.html',
})
export class HeadlessMenubarPageComponent {
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

  public readonly activeSection = computed<HeadlessMenubarDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessMenubarDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessMenubarOutlineItemsBySection[this.activeSection()];
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
    return `Headless menubar ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessMenubarDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessMenubarDocSectionId(section)) {
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
