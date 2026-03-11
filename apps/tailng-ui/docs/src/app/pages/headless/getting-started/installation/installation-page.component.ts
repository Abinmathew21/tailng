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

const installationItem = HEADLESS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'installation',
);
if (installationItem === undefined) {
  throw new Error('Missing "installation" in headless getting-started docs group.');
}

const fallbackData: HeadlessDocsRouteData = toHeadlessDocsRouteData(
  HEADLESS_GETTING_STARTED_GROUP,
  installationItem,
);

@Component({
  selector: 'app-headless-installation-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngIcon,
  ],
  templateUrl: './installation-page.component.html',
  styleUrl: './installation-page.component.css',
})
export class InstallationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as HeadlessDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  protected readonly installCommand =
    'pnpm add @tailng-ui/primitives @tailng-ui/cdk @tailng-ui/theme @tailng-ui/icons';
}
