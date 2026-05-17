import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_RADAR_ROUTES: Routes = buildChartSeriesCategoryRoutes('radar');
