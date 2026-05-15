import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import { filter, map, startWith } from 'rxjs/operators';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type NumberRangeDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const numberRangeDocSectionIds: readonly NumberRangeDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultNumberRangeDocSection: NumberRangeDocSectionId = 'overview';

const numberRangeOutlineItemsBySection: Readonly<
  Record<NumberRangeDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'what-you-get', label: 'What you get' },
    { id: 'simple-examples', label: 'Simple examples' },
    { id: 'installation', label: 'Installation' },
    { id: 'basic-usage', label: 'Basic usage' },
    { id: 'structure', label: 'Structure' },
    { id: 'accessibility-guidance', label: 'Accessibility guidance' },
    { id: 'validation-patterns', label: 'Validation patterns' },
    { id: 'forms-integration', label: 'Forms integration' },
    { id: 'testing-notes', label: 'Testing notes' },
  ],
  api: [
    { id: 'tng-number-range-component', label: '<tng-number-range>' },
    { id: 'inputs-reference', label: 'Inputs reference' },
    { id: 'outputs-reference', label: 'Outputs reference' },
    { id: 'types-reference', label: 'Types reference' },
  ],
  styling: [
    { id: 'css-contracts', label: 'CSS contracts' },
    { id: 'shell-state-hooks', label: 'Shell state hooks' },
    { id: 'theme-contract-tokens', label: 'Theme contract tokens' },
    { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
    { id: 'different-styling-pattern-examples', label: 'Different styling pattern examples' },
  ],
  examples: [
    { id: 'form-usage', label: 'Form usage' },
    { id: 'basic-range', label: 'Basic range' },
    { id: 'with-constraints', label: 'With constraints' },
    { id: 'validation-feedback', label: 'Validation feedback' },
    { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
  ],
} as const;

function isNumberRangeDocSectionId(value: string): value is NumberRangeDocSectionId {
  return numberRangeDocSectionIds.includes(value as NumberRangeDocSectionId);
}

@Component({
  selector: 'app-number-range-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './number-range-page.component.html',
})
export class NumberRangePageComponent {
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

  public readonly activeSection = computed<NumberRangeDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultNumberRangeDocSection;
  });

  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return numberRangeOutlineItemsBySection[this.activeSection()];
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
    return `Number Range ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): NumberRangeDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isNumberRangeDocSectionId(section)) {
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
