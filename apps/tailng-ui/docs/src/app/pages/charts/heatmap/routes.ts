import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_HEATMAP_ROUTES: Routes = buildChartSeriesCategoryRoutes('heatmap');
