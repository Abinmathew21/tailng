import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  getDocsComponentSectionOutlineAriaLabel,
  getDocsComponentSectionOutlineItems,
  getDocsComponentSectionOutlineTitle,
} from '../../../../shared/section-outline/component-section-outline.data';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import { filter, map, startWith } from 'rxjs/operators';

type RadioDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const radioDocSectionIds: readonly RadioDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultRadioDocSection: RadioDocSectionId = 'overview';

function isRadioDocSectionId(value: string): value is RadioDocSectionId {
  return radioDocSectionIds.includes(value as RadioDocSectionId);
}

@Component({
  selector: 'app-radio-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './radio-page.component.html',
})
export class RadioPageComponent {
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

  public readonly activeSection = computed<RadioDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultRadioDocSection;
  });
  private readonly docsItem = this.route.snapshot.data['item'] as
    | { slug?: string; title?: string }
    | undefined;
  private readonly docsItemSlug = this.docsItem?.slug ?? '';
  private readonly docsItemTitle = this.docsItem?.title ?? 'Component';
  public readonly outlineItems = computed(() => {
    return getDocsComponentSectionOutlineItems(this.docsItemSlug, this.activeSection());
  });
  public readonly outlineTitle = computed(() => {
    return getDocsComponentSectionOutlineTitle(this.activeSection());
  });
  public readonly outlineAriaLabel = computed(() => {
    return getDocsComponentSectionOutlineAriaLabel(this.docsItemTitle, this.activeSection());
  });

  private resolveSectionFromUrl(rawUrl: string): RadioDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isRadioDocSectionId(section)) {
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
