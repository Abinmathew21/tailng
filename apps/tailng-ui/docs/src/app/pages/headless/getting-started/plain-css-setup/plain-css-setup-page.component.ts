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

const plainCssSetupItem = HEADLESS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'plain-css-setup',
);
if (plainCssSetupItem === undefined) {
  throw new Error('Missing "plain-css-setup" in headless getting-started docs group.');
}

const fallbackData: HeadlessDocsRouteData = toHeadlessDocsRouteData(
  HEADLESS_GETTING_STARTED_GROUP,
  plainCssSetupItem,
);

@Component({
  selector: 'app-headless-plain-css-setup-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './plain-css-setup-page.component.html',
  styleUrl: './plain-css-setup-page.component.css',
})
export class PlainCssSetupPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as HeadlessDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly cssSetupSteps = [
    'Import TailNG theme contract CSS into your global stylesheet.',
    'Define semantic CSS variables for surface, text, border, accent, and focus tokens.',
    'Compose primitives with your own CSS classes and token aliases.',
  ];
}
