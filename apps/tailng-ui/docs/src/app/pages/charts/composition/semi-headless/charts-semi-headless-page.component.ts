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
} from '@tailng-ui/components';
import { TngIcon } from '@tailng-ui/icons';
import { map } from 'rxjs/operators';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';
import {
  CHARTS_COMPOSITION_GROUP,
  toChartsDocsRouteData,
  type ChartsDocsRouteData,
} from '../../chart-docs.data';

const semiHeadlessItem = CHARTS_COMPOSITION_GROUP.items.find(
  (item) => item.slug === 'semi-headless',
);
if (!semiHeadlessItem) {
  throw new Error('Charts semi-headless item not found.');
}
const fallbackData: ChartsDocsRouteData = toChartsDocsRouteData(
  CHARTS_COMPOSITION_GROUP,
  semiHeadlessItem,
);

@Component({
  selector: 'app-charts-semi-headless-page',
  imports: [
    TngCardComponent,
    TngCardHeaderComponent,
    TngCardTitleComponent,
    TngCardDescriptionComponent,
    TngCardContentComponent,
    TngCodeBlockComponent,
    TngIcon,
  ],
  templateUrl: './charts-semi-headless-page.component.html',
})
export class ChartsSemiHeadlessPageComponent implements OnDestroy {
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

  protected readonly compositionCode = [
    '<tng-chart-root [optionFactory]="optionFactory" [legendItems]="legendItems">',
    '  <tng-chart-surface />',
    '  <tng-chart-legend />',
    '</tng-chart-root>',
  ].join('\n');

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }
}
