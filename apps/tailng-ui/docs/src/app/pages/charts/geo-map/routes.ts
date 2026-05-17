import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_GEO_MAP_ROUTES: Routes = buildChartSeriesCategoryRoutes('geo-map');
