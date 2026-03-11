import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
  TngDrawerComponent,
  TngInputComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  TngDrawerContainer,
  TngDrawerContent,
  TngInput,
  TngInputLeading,
  TngListboxDirective,
  TngOptionDirective,
} from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import {
  buildHeadlessDocHref,
  HEADLESS_DOCS_GROUPS,
  type HeadlessDocsCategoryId,
  type HeadlessDocsGroup,
} from '../headless-docs.data';

@Component({
  selector: 'app-headless-page',
  imports: [
    RouterOutlet,
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    TngBreadcrumbComponent,
    TngBreadcrumbItemComponent,
    TngDrawerContainer,
    TngDrawerContent,
    TngDrawerComponent,
    TngInputComponent,
    TngInput,
    TngInputLeading,
    TngListboxDirective,
    TngOptionDirective,
    TngIcon,
  ],
  templateUrl: './headless-page.component.html',
  styleUrl: './headless-page.component.css',
})
export class HeadlessPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly navGroups = HEADLESS_DOCS_GROUPS;
  public readonly defaultExpandedGroups = HEADLESS_DOCS_GROUPS.map((group) => group.id);
  public readonly navSearchQuery = signal<string>('');
  public readonly filteredNavGroups = computed<readonly HeadlessDocsGroup[]>(() => {
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
      .filter((group): group is HeadlessDocsGroup => group !== null);
  });

  public readonly docsBreadcrumbs = computed<
    readonly { current: boolean; label: string; url: string | null }[]
  >(() => {
    const url = this.normalizeUrl(this.currentUrl());
    const segments = url.split('/').filter((segment) => segment.length > 0);

    const crumbs: { current: boolean; label: string; url: string | null }[] = [
      { current: false, label: 'Home', url: '/' },
      { current: false, label: 'Headless', url: '/headless' },
    ];

    if (segments.length < 2 || segments[0] !== 'headless') {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    const groupId = segments[1] as HeadlessDocsCategoryId | undefined;
    const group = HEADLESS_DOCS_GROUPS.find((candidate) => candidate.id === groupId);
    if (!group) {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    crumbs.push({
      current: false,
      label: group.title,
      url: `/headless/${group.id}`,
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

  public itemHref(groupId: HeadlessDocsCategoryId, itemSlug: string): string {
    return buildHeadlessDocHref(groupId, itemSlug);
  }

  public activeGroupItemHref(group: HeadlessDocsGroup): string | null {
    const current = this.normalizeUrl(this.currentUrl());
    const activeItem = group.items.find((item) => {
      const itemUrl = this.itemHref(group.id, item.slug);
      return this.isMatchingItemPath(current, itemUrl);
    });
    return activeItem ? this.itemHref(group.id, activeItem.slug) : null;
  }

  public onNavListboxValueChange(value: string | readonly string[] | null): void {
    if (typeof value !== 'string' || value.length === 0) {
      return;
    }

    void this.router.navigateByUrl(value);
  }

  public isItemActive(groupId: HeadlessDocsCategoryId, itemSlug: string): boolean {
    return this.isMatchingItemPath(
      this.normalizeUrl(this.currentUrl()),
      this.itemHref(groupId, itemSlug),
    );
  }

  public onNavSearchInput(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.navSearchQuery.set(target.value);
  }

  private groupMatchesQuery(group: HeadlessDocsGroup, query: string): boolean {
    return (
      this.normalizeSearchQuery(group.title).includes(query) ||
      this.normalizeSearchQuery(group.subtitle).includes(query)
    );
  }

  private itemMatchesQuery(item: HeadlessDocsGroup['items'][number], query: string): boolean {
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
