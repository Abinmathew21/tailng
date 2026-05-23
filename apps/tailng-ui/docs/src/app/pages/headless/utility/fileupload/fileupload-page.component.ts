import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { DocsComponentSectionTabsComponent } from '../../../../shared/component-section-tabs/docs-component-section-tabs.component';
import { DocsComponentSectionOutlineComponent } from '../../../../shared/section-outline/docs-component-section-outline.component';
import type { DocsSectionRailItem } from '../../../../shared/section-rail/docs-section-rail.component';

type HeadlessFileuploadDocSectionId = 'api' | 'examples' | 'overview' | 'styling';

const headlessFileuploadDocSectionIds: readonly HeadlessFileuploadDocSectionId[] = [
  'overview',
  'api',
  'styling',
  'examples',
] as const;

const defaultHeadlessFileuploadDocSection: HeadlessFileuploadDocSectionId = 'overview';

const headlessFileuploadOutlineItemsBySection: Readonly<
  Record<HeadlessFileuploadDocSectionId, readonly DocsSectionRailItem[]>
> = {
  overview: [
    { id: 'imports', label: 'Imports' },
    { id: 'quick-drop-zone', label: 'Quick drop zone' },
    { id: 'style-variants', label: 'Style variants' },
    { id: 'accessibility-baseline', label: 'Accessibility baseline' },
  ],
  api: [
    { id: 'directive-selector', label: 'Directive selector' },
    { id: 'inputs-and-outputs', label: 'Inputs and outputs' },
    { id: 'validation-model', label: 'Validation model' },
  ],
  styling: [
    { id: 'host-state-hooks', label: 'Host state hooks' },
    { id: 'css-starter', label: 'CSS starter' },
    { id: 'accessibility-guidance', label: 'Accessibility guidance' },
  ],
  examples: [
    { id: 'basic-drop-zone', label: 'Basic drop zone' },
    { id: 'multiple-and-accept', label: 'Multiple and accept' },
    { id: 'max-size', label: 'Max size validation' },
    { id: 'disabled-drop-zone', label: 'Disabled drop zone' },
  ],
} as const;

function isHeadlessFileuploadDocSectionId(value: string): value is HeadlessFileuploadDocSectionId {
  return headlessFileuploadDocSectionIds.includes(value as HeadlessFileuploadDocSectionId);
}

@Component({
  selector: 'app-headless-fileupload-page',
  imports: [RouterOutlet, DocsComponentSectionTabsComponent, DocsComponentSectionOutlineComponent],
  templateUrl: './fileupload-page.component.html',
})
export class HeadlessFileuploadPageComponent {
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

  public readonly activeSection = computed<HeadlessFileuploadDocSectionId>(() => {
    const section = this.resolveSectionFromUrl(this.currentUrl());
    return section ?? defaultHeadlessFileuploadDocSection;
  });
  public readonly outlineItems = computed<readonly DocsSectionRailItem[]>(() => {
    return headlessFileuploadOutlineItemsBySection[this.activeSection()];
  });
  public readonly outlineTitle = computed<string>(() => {
    switch (this.activeSection()) {
      case 'api':
        return 'API content';
      case 'styling':
        return 'Styling content';
      case 'examples':
        return 'Examples content';
      case 'overview':
      default:
        return 'Overview content';
    }
  });
  public readonly outlineAriaLabel = computed<string>(() => {
    return `Headless FileUpload ${this.activeSection()} section navigation`;
  });

  private resolveSectionFromUrl(rawUrl: string): HeadlessFileuploadDocSectionId | null {
    const path = this.normalizeUrl(rawUrl);
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length < 4) {
      return null;
    }

    const section = segments[3];
    if (section === undefined || !isHeadlessFileuploadDocSectionId(section)) {
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
