import { DOCUMENT } from '@angular/common';
import { Component, inject, input } from '@angular/core';

export type DocsSectionRailItem = Readonly<{
  id: string;
  label: string;
}>;

@Component({
  selector: 'app-docs-section-rail',
  templateUrl: './docs-section-rail.component.html',
  styleUrl: './docs-section-rail.component.css',
})
export class DocsSectionRailComponent {
  private readonly documentRef = inject(DOCUMENT);

  public readonly ariaLabel = input<string>('Page sections');
  public readonly items = input<readonly DocsSectionRailItem[]>([]);
  public readonly title = input<string>('Page content');

  protected onNavigate(sectionId: string): void {
    const section = this.documentRef.getElementById(sectionId);
    if (section === null) {
      return;
    }

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
