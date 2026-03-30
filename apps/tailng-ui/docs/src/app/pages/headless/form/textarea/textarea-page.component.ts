import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessTextareaDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessTextareaDocSectionIds: readonly HeadlessTextareaDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessTextareaDocSection: HeadlessTextareaDocSectionId = 'overview';

const headlessTextareaOutlineItemsBySection: Readonly<
  Record<HeadlessTextareaDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'simple-examples', label: 'Simple examples' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'structure', label: 'Structure' },
    { id: 'rows-and-resize', label: 'Rows and resize' },
    { id: 'accessibility-guidance', label: 'Accessibility guidance' },
    { id: 'validation-patterns', label: 'Validation patterns' },
    { id: 'examples', label: 'Examples' },
    { id: 'common-pitfalls', label: 'Common pitfalls' },
  ],
  api: [
    { id: 'tng-textarea', label: 'tngTextarea' },
    { id: 'tng-input-group', label: 'tngInputGroup' },
    { id: 'slot-directives', label: 'Slot directives' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    {
      id: 'different-styling-pattern-examples',
      label: 'Different styling pattern examples',
    },
  ],
  examples: [
    { id: 'release-notes-field', label: 'Release notes field' },
    { id: 'incident-summary-field', label: 'Incident summary field' },
    { id: 'validation-feedback', label: 'Validation feedback' },
    { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
  ],
} as const;

function isHeadlessTextareaDocSectionId(value: string): value is HeadlessTextareaDocSectionId {
  return headlessTextareaDocSectionIds.includes(value as HeadlessTextareaDocSectionId);
}

@Component({
  selector: 'app-headless-textarea-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './textarea-page.component.html',
})
export class HeadlessTextareaPageComponent {
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

  public readonly activeSection = computed<HeadlessTextareaDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessTextareaDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessTextareaOutlineItemsBySection[this.activeSection()];
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
    return `Headless textarea ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isHeadlessTextareaDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): HeadlessTextareaDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessTextareaDocSectionId(section)) {
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
