import type { Routes } from '@angular/router';
import { buildChartSeriesCategoryRoutes } from '../series/chart-series-category-routes';

export const CHARTS_CALENDAR_ROUTES: Routes = buildChartSeriesCategoryRoutes('calendar');
