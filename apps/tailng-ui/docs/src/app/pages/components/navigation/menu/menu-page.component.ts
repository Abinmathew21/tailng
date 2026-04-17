import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import {
  getDocsComponentSectionOutlineAriaLabel,
  getDocsComponentSectionOutlineItems,
  getDocsComponentSectionOutlineTitle,
} from '../../../../shared/section-outline/component-section-outline.data';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';

type MenuDocPrimarySectionId = 'api' | 'examples' | 'overview' | 'styling';

const menuDocPrimarySectionIds: readonly MenuDocPrimarySectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

type MenuDocSectionId = MenuDocPrimarySectionId | 'ownable-install';

const menuDocSectionIds: readonly MenuDocSectionId[] = [
  ...menuDocPrimarySectionIds,
  'ownable-install',
] as const;

const defaultMenuDocSection: MenuDocSectionId = 'overview';

function isMenuDocSectionId(value: string): value is MenuDocSectionId {
  return menuDocSectionIds.includes(value as MenuDocSectionId);
}

function isMenuDocPrimarySectionId(value: string): value is MenuDocPrimarySectionId {
  return menuDocPrimarySectionIds.includes(value as MenuDocPrimarySectionId);
}

@Component({
  selector: 'app-menu-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab, DocsComponentSectionOutlineComponent],
  templateUrl: './menu-page.component.html',
})
export class MenuPageComponent {
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

  public readonly activeSection = computed<MenuDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultMenuDocSection;
  });

  public readonly activePrimarySection = computed<string | null>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    if (section === null || !isMenuDocPrimarySectionId(section)) {
      return null;
    }

    return section;
  });

  public readonly activeOwnableSection = computed<string | null>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section === 'ownable-install' ? 'ownable-install' : null;
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

  public onPrimarySectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isMenuDocPrimarySectionId(value)) {
      return;
    }

    if (value === this.activePrimarySection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  public onOwnableSectionChange(value: string | number | null): void {
    if (value !== 'ownable-install') {
      return;
    }

    if (this.activeOwnableSection() === 'ownable-install') {
      return;
    }

    void this.router.navigate(['ownable-install'], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): MenuDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isMenuDocSectionId(section)) {
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
