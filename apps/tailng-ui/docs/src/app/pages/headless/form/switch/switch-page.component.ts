import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessSwitchDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessSwitchDocSectionIds: readonly HeadlessSwitchDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessSwitchDocSection: HeadlessSwitchDocSectionId = 'overview';

const headlessSwitchOutlineItemsBySection: Readonly<
  Record<HeadlessSwitchDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'tng-switch', label: 'tngSwitch' },
    { id: 'reflected-attributes', label: 'Reflected attributes' },
    { id: 'change-handling', label: 'Change handling' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'example-shells', label: 'Example shells' },
  ],
  examples: [
    { id: 'release-preferences', label: 'Release preferences' },
    { id: 'privacy-guardrail', label: 'Privacy guardrail' },
    { id: 'disabled-and-required', label: 'Disabled and required' },
  ],
} as const;

function isHeadlessSwitchDocSectionId(value: string): value is HeadlessSwitchDocSectionId {
  return headlessSwitchDocSectionIds.includes(value as HeadlessSwitchDocSectionId);
}

@Component({
  selector: 'app-headless-switch-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './switch-page.component.html',
})
export class HeadlessSwitchPageComponent {
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

  public readonly activeSection = computed<HeadlessSwitchDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessSwitchDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessSwitchOutlineItemsBySection[this.activeSection()];
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
    return `Headless switch ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessSwitchDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessSwitchDocSectionId(section)) {
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
