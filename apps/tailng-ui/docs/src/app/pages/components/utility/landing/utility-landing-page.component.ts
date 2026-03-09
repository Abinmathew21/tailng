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
  COMPONENTS_UTILITY_GROUP,
  toComponentsDocsRouteData,
  type ComponentsDocsRouteData,
} from '../../component-docs.data';

const fallbackData: ComponentsDocsRouteData = toComponentsDocsRouteData(
  COMPONENTS_UTILITY_GROUP,
  COMPONENTS_UTILITY_GROUP.items[0]!,
);

@Component({
  selector: 'app-utility-landing-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './utility-landing-page.component.html',
  styleUrl: './utility-landing-page.component.css',
})
export class UtilityLandingPageComponent {
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
