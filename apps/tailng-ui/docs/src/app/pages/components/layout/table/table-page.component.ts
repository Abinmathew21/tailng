import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import {
  getDocsComponentSectionOutlineAriaLabel,
  getDocsComponentSectionOutlineItems,
  getDocsComponentSectionOutlineTitle,
} from '../../../../shared/section-outline/component-section-outline.data';

type TableDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const tableDocSectionIds: readonly TableDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultTableDocSection: TableDocSectionId = 'overview';

function isTableDocSectionId(value: string): value is TableDocSectionId {
  return tableDocSectionIds.includes(value as TableDocSectionId);
}

@Component({
  selector: 'app-table-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './table-page.component.html',
})
export class TablePageComponent {
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
  private readonly docsItem = this.route.snapshot.data['item'] as
    | { slug?: string; title?: string }
    | undefined;
  private readonly docsItemSlug = this.docsItem?.slug ?? '';
  private readonly docsItemTitle = this.docsItem?.title ?? 'Component';

  public readonly activeSection = computed<TableDocSectionId>(() => {
    return this.resolveSectionFromUrl(this.currentUrl()) ?? defaultTableDocSection;
  });
  public readonly outlineItems = computed(() => {
    return getDocsComponentSectionOutlineItems(this.docsItemSlug, this.activeSection());
  });
  public readonly outlineTitle = computed(() => {
    return getDocsComponentSectionOutlineTitle(this.activeSection());
  });
  public readonly outlineAriaLabel = computed(() => {
    return getDocsComponentSectionOutlineAriaLabel(this.docsItemTitle, this.activeSection());
  });

  private resolveSectionFromUrl(rawUrl: string): TableDocSectionId | null {
    const segments = this.normalizeUrl(rawUrl).split('/').filter(Boolean);
    const section = segments[3];
    return section !== undefined && isTableDocSectionId(section) ? section : null;
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
    return normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  }
}
