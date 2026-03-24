import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type InputDocSectionId = 'api' | 'examples' | 'overview' | 'ownable-install' | 'styling';

const inputDocSectionIds: readonly InputDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
  'ownable-install',
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
      { id: 'examples', label: 'Examples' },
      { id: 'common-pitfalls', label: 'Common pitfalls' },
    ],
    api: [
      { id: 'tng-input', label: 'tngInput' },
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
      { id: 'global-search-field', label: 'Global search field' },
      { id: 'workspace-slug-field', label: 'Workspace slug field' },
      { id: 'validation-feedback', label: 'Validation feedback' },
      { id: 'readonly-and-disabled-states', label: 'Readonly and disabled states' },
    ],
    'ownable-install': [
      { id: 'install-from-registry', label: 'Install from registry' },
      { id: 'generated-files', label: 'Generated files' },
      { id: 'import-and-usage', label: 'Import and usage' },
    ],
  } as const;

function isInputDocSectionId(value: string): value is InputDocSectionId {
  return inputDocSectionIds.includes(value as InputDocSectionId);
}

@Component({
  selector: 'app-input-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
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
      case 'ownable-install':
        return 'Install content';
      case 'overview':
      default:
        return 'Overview content';
    }
  });
  public readonly outlineAriaLabel = computed<string>(() => {
    return `Input ${this.activeSection()} section navigation`;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isInputDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

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
