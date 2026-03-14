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
  COMPONENTS_FEEDBACK_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_FEEDBACK_GROUP,
  COMPONENTS_FEEDBACK_GROUP.items[0]!,
);

@Component({
  selector: 'app-feedback-landing-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './feedback-landing-page.component.html',
  styleUrl: './feedback-landing-page.component.css',
})
export class FeedbackLandingPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ComponentsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);
}
