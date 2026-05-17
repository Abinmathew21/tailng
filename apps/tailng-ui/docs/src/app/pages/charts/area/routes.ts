import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_AREA_ROUTES: Routes = buildChartSeriesCategoryRoutes('area');
