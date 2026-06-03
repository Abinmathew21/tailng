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

type TreeTableDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const treeTableDocSectionIds: readonly TreeTableDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultTreeTableDocSection: TreeTableDocSectionId = 'overview';

function isTreeTableDocSectionId(value: string): value is TreeTableDocSectionId {
  return treeTableDocSectionIds.includes(value as TreeTableDocSectionId);
}

@Component({
  selector: 'app-tree-table-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './tree-table-page.component.html',
})
export class TreeTablePageComponent {
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

  public readonly activeSection = computed<TreeTableDocSectionId>(() => {
    return this.resolveSectionFromUrl(this.currentUrl()) ?? defaultTreeTableDocSection;
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

  private resolveSectionFromUrl(rawUrl: string): TreeTableDocSectionId | null {
    const segments = this.normalizeUrl(rawUrl).split('/').filter(Boolean);
    const section = segments[3];
    return section !== undefined && isTreeTableDocSectionId(section) ? section : null;
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
