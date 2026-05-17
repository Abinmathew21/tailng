import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_SANKEY_ROUTES: Routes = buildChartSeriesCategoryRoutes('sankey');
