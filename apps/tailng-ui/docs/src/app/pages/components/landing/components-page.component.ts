import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngDrawerComponent,
  TngFormFieldComponent,
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  TngDrawerContainer,
  TngDrawerContent,
  TngInput,
  TngPrefix,
} from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import {
  buildComponentsDocHref,
  COMPONENTS_DOCS_GROUPS,
  type ComponentsDocsCategoryId,
  type ComponentsDocsGroup,
  type ComponentsDocsItem,
} from '../component-docs.data';

@Component({
  selector: 'app-components-page',
  imports: [
    RouterOutlet,
    RouterLink,
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngDrawerContainer,
    TngDrawerContent,
    TngDrawerComponent,
    TngFormFieldComponent,
    TngInput,
    TngPrefix,
    TngIcon,
  ],
  templateUrl: './components-page.component.html',
  styleUrl: './components-page.component.css',
})
export class ComponentsPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly navGroups = COMPONENTS_DOCS_GROUPS;
  public readonly defaultExpandedGroups = COMPONENTS_DOCS_GROUPS.map((group) => group.id);
  public readonly navSearchQuery = signal<string>('');
  public readonly filteredNavGroups = computed<readonly ComponentsDocsGroup[]>(() => {
    const query = this.normalizeSearchQuery(this.navSearchQuery());
    if (query.length === 0) {
      return this.navGroups;
    }

    return this.navGroups
      .map((group) => {
        if (this.groupMatchesQuery(group, query)) {
          return group;
        }

        const matchingItems = group.items.filter((item) => this.itemMatchesQuery(item, query));
        if (matchingItems.length === 0) {
          return null;
        }

        return {
          ...group,
          items: matchingItems,
        };
      })
      .filter((group): group is ComponentsDocsGroup => group !== null);
  });

  public readonly docsBreadcrumbs = computed<
    readonly { current: boolean; label: string; url: string | null }[]
  >(() => {
    const url = this.normalizeUrl(this.currentUrl());
    const segments = url.split('/').filter((segment) => segment.length > 0);

    const crumbs: { current: boolean; label: string; url: string | null }[] = [
      { current: false, label: 'Home', url: '/' },
      { current: false, label: 'Components', url: '/components' },
    ];

    if (segments.length < 2 || segments[0] !== 'components') {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    const groupId = segments[1] as ComponentsDocsCategoryId | undefined;
    const group = COMPONENTS_DOCS_GROUPS.find((candidate) => candidate.id === groupId);
    if (!group) {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    crumbs.push({
      current: false,
      label: group.title,
      url: `/components/${group.id}`,
    });

    const itemSlug = segments[2];
    const item = group.items.find((candidate) => candidate.slug === itemSlug);
    if (!item) {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    crumbs.push({
      current: true,
      label: item.title,
      url: null,
    });

    return crumbs;
  });

  public itemHref(groupId: ComponentsDocsCategoryId, itemSlug: string): string {
    return buildComponentsDocHref(groupId, itemSlug);
  }

  public isNavItemActive(group: ComponentsDocsGroup, item: ComponentsDocsItem): boolean {
    const current = this.normalizeUrl(this.currentUrl());
    return this.isMatchingItemPath(current, this.itemHref(group.id, item.slug));
  }

  public onNavSearchInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.navSearchQuery.set(target.value);
  }

  private groupMatchesQuery(group: ComponentsDocsGroup, query: string): boolean {
    return (
      this.normalizeSearchQuery(group.title).includes(query) ||
      this.normalizeSearchQuery(group.subtitle).includes(query)
    );
  }

  private itemMatchesQuery(item: ComponentsDocsGroup['items'][number], query: string): boolean {
    return (
      this.normalizeSearchQuery(item.title).includes(query) ||
      this.normalizeSearchQuery(item.slug).includes(query) ||
      this.normalizeSearchQuery(item.description).includes(query)
    );
  }

  private normalizeSearchQuery(value: string): string {
    return value.trim().toLowerCase();
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

  private isMatchingItemPath(currentUrl: string, itemUrl: string): boolean {
    if (currentUrl === itemUrl) {
      return true;
    }

    return currentUrl.startsWith(`${itemUrl}/`);
  }
}
