import { computed, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import {
  HEADLESS_GETTING_STARTED_GROUP,
  toHeadlessDocsRouteData,
  type HeadlessDocsRouteData,
} from '../../headless-docs.data';

const tailwindSetupItem = HEADLESS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'tailwind-setup',
);
if (tailwindSetupItem === undefined) {
  throw new Error('Missing "tailwind-setup" in headless getting-started docs group.');
}

const fallbackData: HeadlessDocsRouteData = toHeadlessDocsRouteData(
  HEADLESS_GETTING_STARTED_GROUP,
  tailwindSetupItem,
);

@Component({
  selector: 'app-headless-tailwind-setup-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './tailwind-setup-page.component.html',
  styleUrl: './tailwind-setup-page.component.css',
})
export class TailwindSetupPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as HeadlessDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly tailwindSetupSteps = [
    'Install and configure Tailwind content scanning for Angular templates.',
    'Expose TailNG semantic tokens in global styles for consistent theming.',
    'Use utility classes for layout while primitives handle behavior and accessibility.',
  ];
}
