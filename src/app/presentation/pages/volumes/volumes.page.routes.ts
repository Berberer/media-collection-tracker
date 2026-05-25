import { Routes } from '@angular/router';

import { CollectedVolumesPage } from './collected-volumes/collected-volumes.page';
import { MissingVolumesPage } from './missing-volumes/missing-volumes.page';
import { VolumesTrackingDashboardPage } from './volumes-tracking-dashboard/volumes-tracking-dashboard.page';

enum VolumesRoutes {
  Dashboard = 'tracking-dashboard',
  Missing = 'missing',
  Collected = 'collected',
}

export const volumesRoutes: Routes = [
  {
    path: VolumesRoutes.Dashboard,
    component: VolumesTrackingDashboardPage,
  },
  {
    path: VolumesRoutes.Missing,
    component: MissingVolumesPage,
  },
  {
    path: VolumesRoutes.Collected,
    component: CollectedVolumesPage,
  },

  { path: '', redirectTo: VolumesRoutes.Dashboard, pathMatch: 'full' },
  { path: '**', redirectTo: VolumesRoutes.Dashboard, pathMatch: 'full' },
];
