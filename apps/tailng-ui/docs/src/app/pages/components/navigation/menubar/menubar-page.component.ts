import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList } from '@tailng-ui/primitives';
import { filter, map, startWith } from 'rxjs/operators';

type MenubarDocSectionId = 'api' | 'examples' | 'overview' | 'ownable-install' | 'styling';

const menubarDocSectionIds: readonly MenubarDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
  'ownable-install',
] as const;

const defaultMenubarDocSection: MenubarDocSectionId = 'overview';

function isMenubarDocSectionId(value: string): value is MenubarDocSectionId {
  return menubarDocSectionIds.includes(value as MenubarDocSectionId);
}

@Component({
  selector: 'app-menubar-page',
  imports: [RouterOutlet, TngTabsComponent, TngTabList, TngTab],
  templateUrl: './menubar-page.component.html',
  styleUrls: ['./menubar-page.component.css'],
})
export class MenubarPageComponent {
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

  public readonly activeSection = computed<MenubarDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultMenubarDocSection;
  });

  public onSectionChange(value: string | number | null): void {
    if (typeof value !== 'string' || !isMenubarDocSectionId(value)) {
      return;
    }

    if (value === this.activeSection()) {
      return;
    }

    void this.router.navigate([value], { relativeTo: this.route });
  }

  private resolveSectionFromUrl(rawUrl: string): MenubarDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isMenubarDocSectionId(section)) {
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
