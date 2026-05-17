import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal, type OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  TngCardComponent,
  TngCardContentComponent,
  TngCardDescriptionComponent,
  TngCardHeaderComponent,
  TngCardTitleComponent,
  TngCodeBlockComponent,
  TngTabsComponent,
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import { map } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import {
  CHARTS_GETTING_STARTED_GROUP,
  toChartsDocsRouteData,
  type ChartsDocsRouteData,
} from '../../chart-docs.data';

const installationItem = CHARTS_GETTING_STARTED_GROUP.items.find(
  (item) => item.slug === 'installation',
);
if (!installationItem) {
  throw new Error('Charts installation item not found.');
}
const fallbackData: ChartsDocsRouteData = toChartsDocsRouteData(
  CHARTS_GETTING_STARTED_GROUP,
  installationItem,
);

@Component({
  selector: 'app-charts-installation-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    TngIcon,
  ],
  templateUrl: './charts-installation-page.component.html',
  styleUrl: './charts-installation-page.component.css',
})
export class ChartsInstallationPageComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentRef = inject(DOCUMENT);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => (data as ChartsDocsRouteData | undefined) ?? fallbackData),
    ),
    { initialValue: fallbackData },
  );

  public readonly item = computed(() => this.routeData().item);
  public readonly groupTitle = computed(() => this.routeData().groupTitle);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly installPnpmCode = 'pnpm add @tailng-ui/charts echarts';
  protected readonly installNpmCode = 'npm install @tailng-ui/charts echarts';
  protected readonly installYarnCode = 'yarn add @tailng-ui/charts echarts';

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
