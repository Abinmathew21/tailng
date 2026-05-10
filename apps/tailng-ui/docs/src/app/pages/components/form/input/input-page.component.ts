import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import { filter, map, startWith } from 'rxjs/operators';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type InputDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const inputDocSectionIds: readonly InputDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultInputDocSection: InputDocSectionId = 'overview';

const inputOutlineItemsBySection: Readonly<Record<InputDocSectionId, readonly DocsSectionRailItem[]>> =
  {
    overview: [
      { id: 'what-you-get', label: 'What you get' },
      { id: 'simple-examples', label: 'Simple examples' },
      { id: 'installation', label: 'Installation' },
      { id: 'basic-usage', label: 'Basic usage' },
      { id: 'structure', label: 'Structure' },
      { id: 'accessibility-guidance', label: 'Accessibility guidance' },
      { id: 'validation-patterns', label: 'Validation patterns' },
      { id: 'interaction-behavior', label: 'Interaction behavior' },
      { id: 'examples', label: 'Examples' },
      { id: 'common-pitfalls', label: 'Common pitfalls' },
      { id: 'testing-notes', label: 'Testing notes' },
    ],
    api: [
      { id: 'tng-input-component', label: '<tng-input>' },
      { id: 'tng-input-field', label: '<tng-input-field>' },
      { id: 'tng-input-directive', label: 'tngInput' },
      { id: 'slot-directives', label: 'Slot directives' },
    ],
    styling: [
      { id: 'css-contracts', label: 'CSS contracts' },
      { id: 'shell-state-hooks', label: 'Shell state hooks' },
      { id: 'theme-contract-tokens', label: 'Theme contract tokens' },
      { id: 'user-scenario-style-examples', label: 'User scenario style examples' },
      {
        id: 'different-styling-pattern-examples',
        label: 'Different styling pattern examples',
      },
    ],
    examples: [
      { id: 'form-usage', label: 'Form usage' },
      { id: 'basic-text-field', label: 'Basic text field' },
      { id: 'type-variants', label: 'Type variants' },
      { id: 'validation-feedback', label: 'Validation feedback' },
      { id: 'number-controls', label: 'Number controls' },
      { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
    ],
  } as const;

function isInputDocSectionId(value: string): value is InputDocSectionId {
  return inputDocSectionIds.includes(value as InputDocSectionId);
}

@Component({
  selector: 'app-input-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './input-page.component.html',
})
export class InputPageComponent {
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

  public readonly activeSection = computed<InputDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultInputDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return inputOutlineItemsBySection[this.activeSection()];
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
    return `Input ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): InputDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isInputDocSectionId(section)) {
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
