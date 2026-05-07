import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngDrawerComponent,
  TngBreadcrumbComponent,
  TngBreadcrumbItemComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import {
  TngDrawerContainer,
  TngDrawerContent,
} from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';
import {
  buildOwnableDocHref,
  OWNABLE_DOCS_GROUPS,
  type OwnableDocsCategoryId,
  type OwnableDocsGroup,
} from '../ownable-docs.data';
import { DocsComponentSectionOutlineComponent } from '../../../shared/section-outline/docs-component-section-outline.component';

@Component({
  selector: 'app-ownable-page',
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
    TngIcon,
    DocsComponentSectionOutlineComponent,
  ],
  templateUrl: './ownable-page.component.html',
  styleUrls: ['../../components/landing/components-page.component.css', './ownable-page.component.css'],
})
export class OwnablePageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly navGroups = OWNABLE_DOCS_GROUPS;
  public readonly defaultExpandedGroups = OWNABLE_DOCS_GROUPS.map((group) => group.id);
  public readonly filteredNavGroups = computed<readonly OwnableDocsGroup[]>(() => this.navGroups);

  public readonly docsBreadcrumbs = computed<
    readonly { current: boolean; label: string; url: string | null }[]
  >(() => {
    const url = this.normalizeUrl(this.currentUrl());
    const segments = url.split('/').filter((segment) => segment.length > 0);

    const crumbs: { current: boolean; label: string; url: string | null }[] = [
      { current: false, label: 'Home', url: '/' },
      { current: false, label: 'Ownable', url: '/ownable' },
    ];

    if (segments.length < 2 || segments[0] !== 'ownable') {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    const groupId = segments[1] as OwnableDocsCategoryId | undefined;
    const group = OWNABLE_DOCS_GROUPS.find((candidate) => candidate.id === groupId);
    if (!group) {
      crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], current: true, url: null };
      return crumbs;
    }

    crumbs.push({
      current: false,
      label: group.title,
      url: `/ownable/${group.id}`,
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

  public itemHref(groupId: OwnableDocsCategoryId, itemSlug: string): string {
    return buildOwnableDocHref(groupId, itemSlug);
  }

  public isItemActive(groupId: OwnableDocsCategoryId, itemSlug: string): boolean {
    return this.isMatchingItemPath(
      this.normalizeUrl(this.currentUrl()),
      this.itemHref(groupId, itemSlug),
    );
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
