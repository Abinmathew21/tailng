import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_SUNBURST_ROUTES: Routes = buildChartSeriesCategoryRoutes('sunburst');
