import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';

type MenuDocSectionId = 'api' | 'examples' | 'overview' | 'ownable-install' | 'styling';

const menuDocSectionIds: readonly MenuDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
  'ownable-install',
] as const;

const defaultMenuDocSection: MenuDocSectionId = 'overview';

function isMenuDocSectionId(value: string): value is MenuDocSectionId {
  return menuDocSectionIds.includes(value as MenuDocSectionId);
}

@Component({
  selector: 'app-menu-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab],
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css'],
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

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isMenuDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
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
