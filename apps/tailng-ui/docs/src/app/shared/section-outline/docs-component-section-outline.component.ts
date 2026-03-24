import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input, NgZone, signal } from '@angular/core';
import {
  DocsSectionRailComponent,
  type DocsSectionRailItem,
} from '../section-rail/docs-section-rail.component';

@Component({
  selector: 'app-docs-component-section-outline',
  imports: [DocsSectionRailComponent],
  templateUrl: './docs-component-section-outline.component.html',
  styleUrl: './docs-component-section-outline.component.css',
  host: {
    '[class.docs-component-section-outline-empty]': 'resolvedItems().length === 0',
  },
})
export class DocsComponentSectionOutlineComponent {
  private readonly documentRef = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);

  public readonly ariaLabel = input<string>('Page sections');
  public readonly items = input<readonly DocsSectionRailItem[] | null>(null);
  public readonly title = input<string>('Page content');
  public readonly contentRoot = input<HTMLElement | null>(null);

  protected readonly discoveredItems = signal<readonly DocsSectionRailItem[]>([]);
  protected readonly resolvedItems = computed<readonly DocsSectionRailItem[]>(() => {
    return this.items() ?? this.discoveredItems();
  });

  public constructor() {
    effect(
      (onCleanup) => {
        const contentRoot = this.contentRoot();
        const explicitItems = this.items();
        const syncItems = () => {
          if (contentRoot !== null && explicitItems !== null) {
            this.applyExplicitItems(contentRoot, explicitItems);
          }
          this.discoveredItems.set(this.collectItems(contentRoot));
        };

        this.ngZone.run(syncItems);

        const mutationObserverCtor = this.documentRef.defaultView?.MutationObserver;
        if (contentRoot === null || mutationObserverCtor === undefined) {
          return;
        }

        queueMicrotask(() => {
          this.ngZone.run(syncItems);
        });

        const observer = new mutationObserverCtor(() => {
          this.ngZone.run(syncItems);
        });

        observer.observe(contentRoot, {
          characterData: true,
          childList: true,
          subtree: true,
        });

        onCleanup(() => observer.disconnect());
      },
      { allowSignalWrites: true },
    );
  }

  private applyExplicitItems(
    contentRoot: HTMLElement,
    explicitItems: readonly DocsSectionRailItem[],
  ): void {
    if (explicitItems.length === 0) {
      return;
    }

    const pageHost = Array.from(contentRoot.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && !child.hidden,
    );
    if (pageHost === undefined) {
      return;
    }

    const contentContainer = this.resolveContentContainer(pageHost);
    const targets = this.collectDirectChildTargets(contentContainer);
    const limit = Math.min(explicitItems.length, targets.length);

    for (let index = 0; index < limit; index += 1) {
      const item = explicitItems[index];
      const target = targets[index];
      if (item === undefined || target === undefined) {
        continue;
      }

      target.id = item.id;
      target.classList.add('docs-section-anchor');
    }
  }

  private collectItems(contentRoot: HTMLElement | null): readonly DocsSectionRailItem[] {
    if (contentRoot === null) {
      return [];
    }

    const pageHost = Array.from(contentRoot.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && !child.hidden,
    );

    if (pageHost === undefined) {
      return [];
    }

    const contentContainer = this.resolveContentContainer(pageHost);
    const anchoredItems = this.collectAnchoredItems(contentContainer);
    if (anchoredItems.length > 0) {
      return anchoredItems;
    }

    return this.collectDirectChildItems(contentContainer);
  }

  private collectAnchoredItems(contentContainer: HTMLElement): readonly DocsSectionRailItem[] {
    const items: DocsSectionRailItem[] = [];
    const usedIds = new Set<string>();

    for (const section of Array.from(contentContainer.querySelectorAll('.docs-section-anchor'))) {
      if (!(section instanceof HTMLElement) || section.hidden) {
        continue;
      }

      const label = this.resolveLabel(section);
      if (label === null) {
        continue;
      }

      const id = this.ensureSectionId(section, label, usedIds);
      section.classList.add('docs-section-anchor');
      items.push({ id, label });
    }

    return items;
  }

  private collectDirectChildItems(contentContainer: HTMLElement): readonly DocsSectionRailItem[] {
    const items: DocsSectionRailItem[] = [];
    const usedIds = new Set<string>();

    for (const child of this.collectDirectChildTargets(contentContainer)) {
      const label = this.resolveLabel(child);
      if (label === null) {
        continue;
      }

      const id = this.ensureSectionId(child, label, usedIds);
      child.classList.add('docs-section-anchor');
      items.push({ id, label });
    }

    return items;
  }

  private collectDirectChildTargets(contentContainer: HTMLElement): readonly HTMLElement[] {
    const targets: HTMLElement[] = [];

    for (const child of Array.from(contentContainer.children)) {
      if (!(child instanceof HTMLElement) || child.hidden) {
        continue;
      }

      if (this.resolveLabel(child) === null) {
        continue;
      }

      targets.push(child);
    }

    return targets;
  }

  private resolveContentContainer(pageHost: HTMLElement): HTMLElement {
    const firstChild = pageHost.firstElementChild;
    if (firstChild instanceof HTMLElement) {
      if (firstChild.classList.contains('docs-section-page')) {
        const mainContent = firstChild.querySelector(':scope > .docs-section-page-main');
        if (mainContent instanceof HTMLElement) {
          return mainContent;
        }
      }

      return firstChild;
    }

    return pageHost;
  }

  private resolveLabel(element: HTMLElement): string | null {
    const heading = element.querySelector('h3, h2, h4');
    if (!(heading instanceof HTMLElement)) {
      const attributeLabel =
        element.getAttribute('data-section-label') ??
        element.getAttribute('heading') ??
        element.getAttribute('aria-label');
      const normalizedAttributeLabel = attributeLabel?.trim() ?? '';
      return normalizedAttributeLabel === '' ? null : normalizedAttributeLabel;
    }

    const label = heading.textContent?.trim() ?? '';
    return label === '' ? null : label;
  }

  private ensureSectionId(element: HTMLElement, label: string, usedIds: Set<string>): string {
    const existingId = element.id.trim();
    if (existingId !== '') {
      usedIds.add(existingId);
      return existingId;
    }

    const baseId = this.slugify(label);
    let candidateId = baseId;
    let suffix = 2;

    while (usedIds.has(candidateId) || this.documentRef.getElementById(candidateId) !== null) {
      candidateId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    element.id = candidateId;
    usedIds.add(candidateId);
    return candidateId;
  }

  private slugify(value: string): string {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug === '' ? 'section' : slug;
  }
}
