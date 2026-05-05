import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessToastDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessToastDocSectionIds: readonly HeadlessToastDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessToastDocSection: HeadlessToastDocSectionId = 'overview';

const headlessToastOutlineItemsBySection: Readonly<
  Record<HeadlessToastDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'basic-composition', label: 'Basic composition' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'behavior-baseline', label: 'Behavior baseline' },
  ],
  api: [
    { id: 'viewport-primitive', label: 'Viewport primitive' },
    { id: 'item-primitive', label: 'Item primitive' },
    { id: 'behavior-and-semantics', label: 'Behavior and semantics' },
  ],
  styling: [
    { id: 'slot-and-state-hooks', label: 'Slot and state hooks' },
    { id: 'css-starter', label: 'CSS starter' },
    { id: 'owner-guidance', label: 'Owner guidance' },
  ],
  examples: [
    { id: 'activity-stream-notifications', label: 'Activity stream notifications' },
    { id: 'fixed-corner-stack', label: 'Fixed corner stack' },
    { id: 'escalation-notifications', label: 'Escalation notifications' },
  ],
} as const;

function isHeadlessToastDocSectionId(value: string): value is HeadlessToastDocSectionId {
  return headlessToastDocSectionIds.includes(value as HeadlessToastDocSectionId);
}

@Component({
  selector: 'app-headless-toast-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './toast-page.component.html',
})
export class HeadlessToastPageComponent {
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

  public readonly activeSection = computed<HeadlessToastDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessToastDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessToastOutlineItemsBySection[this.activeSection()];
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
    return `Headless toast ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessToastDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessToastDocSectionId(section)) {
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
