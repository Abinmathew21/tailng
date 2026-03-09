import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  TngAccordionComponent,
  TngAccordionItemComponent,
  TngAccordionPanelComponent,
  TngAccordionTriggerComponent,
  TngDrawerComponent,
} from '@tailng-ui/components';
import { TngDrawerContainer, TngDrawerContent } from '@tailng-ui/primitives';
import { TngIcon } from '@tailng-ui/icons';
import { filter, map, startWith } from 'rxjs/operators';
import {
  buildComponentsDocHref,
  COMPONENTS_DOCS_GROUPS,
  type ComponentsDocsCategoryId,
} from '../component-docs.data';

@Component({
  selector: 'app-components-page',
  imports: [
    RouterLink,
    RouterOutlet,
    TngAccordionComponent,
    TngAccordionItemComponent,
    TngAccordionTriggerComponent,
    TngAccordionPanelComponent,
    TngDrawerContainer,
    TngDrawerContent,
    TngDrawerComponent,
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

  public itemHref(groupId: ComponentsDocsCategoryId, itemSlug: string): string {
    return buildComponentsDocHref(groupId, itemSlug);
  }

  public isItemActive(groupId: ComponentsDocsCategoryId, itemSlug: string): boolean {
    return this.normalizeUrl(this.currentUrl()) === this.itemHref(groupId, itemSlug);
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
