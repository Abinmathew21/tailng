import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { ChartWrapperLiveDemoComponent } from '../chart-wrapper-live-demo.component';
import {
  resolveChartWrapperDocConfig,
  type ChartWrapperDocConfig,
} from '../chart-wrapper-docs.config';
import { resolveChartWrapperSlugFromUrl } from '../chart-wrapper-route.util';

@Component({
  selector: 'app-chart-wrapper-examples-page',
  imports: [ChartWrapperLiveDemoComponent],
  templateUrl: './chart-wrapper-examples-page.component.html',
  styleUrl: './chart-doc-section.css',
})
export class ChartWrapperExamplesPageComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  public readonly config = computed<ChartWrapperDocConfig | null>(() => {
    const slug = resolveChartWrapperSlugFromUrl(this.currentUrl());
    return slug ? resolveChartWrapperDocConfig(slug) : null;
  });
}
