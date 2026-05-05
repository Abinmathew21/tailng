import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessCheckboxDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessCheckboxDocSectionIds: readonly HeadlessCheckboxDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessCheckboxDocSection: HeadlessCheckboxDocSectionId = 'overview';

const headlessCheckboxOutlineItemsBySection: Readonly<
  Record<HeadlessCheckboxDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'tng-checkbox', label: 'tngCheckbox' },
    { id: 'output-attributes', label: 'Output attributes' },
    { id: 'change-handling', label: 'Change handling' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'state-selectors', label: 'State selectors' },
    { id: 'example-shells', label: 'Example shells' },
  ],
  examples: [
    { id: 'consent-checklist', label: 'Consent checklist' },
    { id: 'tri-state-rollup', label: 'Tri-state rollup' },
    { id: 'validation-and-readonly', label: 'Validation and readonly' },
  ],
} as const;

function isHeadlessCheckboxDocSectionId(
  value: string,
): value is HeadlessCheckboxDocSectionId {
  return headlessCheckboxDocSectionIds.includes(value as HeadlessCheckboxDocSectionId);
}

@Component({
  selector: 'app-headless-checkbox-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './checkbox-page.component.html',
})
export class HeadlessCheckboxPageComponent {
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

  public readonly activeSection = computed<HeadlessCheckboxDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessCheckboxDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessCheckboxOutlineItemsBySection[this.activeSection()];
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
    return `Headless checkbox ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessCheckboxDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessCheckboxDocSectionId(section)) {
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
