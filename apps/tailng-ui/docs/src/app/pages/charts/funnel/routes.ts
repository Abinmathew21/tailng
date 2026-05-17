import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_FUNNEL_ROUTES: Routes = buildChartSeriesCategoryRoutes('funnel');
