import { Component, computed, signal } from '@angular/core';
import { TngListboxDirective, TngOptionDirective } from '@tailng-ui/primitives'; // adjust path

type DemoOption = Readonly<{
  description: string;
  disabled?: boolean;
  id: string;
  label: string;
}>;

const demoOptions: readonly DemoOption[] = Object.freeze([
  {
    description: 'Experimental wrapper track for future Angular 22 alignment.',
    id: 'angular-aria',
    label: 'Angular ARIA Wrapper',
  },
  {
    description: 'Fallback behavior primitives for focus and overlays.',
    id: 'angular-cdk',
    label: 'Angular CDK Adapter',
  },
  {
    description: 'Reference implementation and compatibility baseline.',
    id: 'angular-material',
    label: 'Angular Material Bridge',
  },
  {
    description: 'Style integration target for utility-class consumers.',
    id: 'tailwind',
    label: 'Tailwind Styling',
  },
  {
    description: 'Ongoing a11y verification in CI and component acceptance tests.',
    id: 'a11y-audit',
    label: 'Accessibility Audits',
  },
  {
    description: 'Reserved work item for post-listbox component wave.',
    disabled: true,
    id: 'future-roadmap',
    label: 'Future Roadmap (disabled)',
  },
]);

const optionById: ReadonlyMap<string, DemoOption> = new Map(
  demoOptions.map((option) => [option.id, option] as const),
);

@Component({
  selector: 'app-listbox-playground-page',
  standalone: true,
  imports: [TngListboxDirective, TngOptionDirective],
  templateUrl: './listbox-playground-page.component.html',
  styleUrl: './listbox-playground-page.component.css',
})
export class ListboxPlaygroundPageComponent {
  public readonly options = demoOptions;

  // Demo toggles (optional)
  public readonly multiple = signal(true);
  public readonly loop = signal(true);
  public readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
  public readonly direction = signal<'ltr' | 'rtl'>('ltr');
  public readonly listboxDisabled = signal(false);

  // Controlled value (what listbox writes to)
  // - single: string | null
  // - multiple: readonly string[]
  public readonly value = signal<string | readonly string[] | null>([]);

  public readonly activeLabel = computed((): string => {
    // In primitives, activeId is internal to directive, so we only show selected state here.
    // If you want active label, expose activeId from TngListboxDirective later.
    return 'See active highlight';
  });

  public readonly selectedLabel = computed((): string => {
    const current = this.value();

    const ids: readonly string[] =
      current === null
        ? []
        : Array.isArray(current)
          ? current
          : [current];

    const labels = ids
      .map((id) => optionById.get(id)?.label)
      .filter((label): label is string => label !== undefined);

    return labels.length === 0 ? 'None' : labels.join(', ');
  });

  public toggleMultiple(): void {
    const next = !this.multiple();
    this.multiple.set(next);

    // reset controlled value shape when mode changes
    this.value.set(next ? ([] as readonly string[]) : null);
  }

  public clearSelection(): void {
    this.value.set(this.multiple() ? ([] as readonly string[]) : null);
  }
}