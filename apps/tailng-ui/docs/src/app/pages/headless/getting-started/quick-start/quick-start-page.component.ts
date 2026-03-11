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

const quickStartItem = HEADLESS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'quick-start',
);
if (quickStartItem === undefined) {
  throw new Error('Missing "quick-start" in headless getting-started docs group.');
}

const fallbackData: HeadlessDocsRouteData = toHeadlessDocsRouteData(
  HEADLESS_GETTING_STARTED_GROUP,
  quickStartItem,
);

@Component({
  selector: 'app-headless-quick-start-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './quick-start-page.component.html',
  styleUrl: './quick-start-page.component.css',
})
export class QuickStartPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as HeadlessDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly quickStartChecklist = [
    'Install the primitives package and required peers for your Angular workspace.',
    'Render a headless primitive in your template and attach your own classes/tokens.',
    'Verify keyboard behavior and focus management against the primitive contract.',
  ];
}
