import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChambreComponent } from '../list/chambre.component';
import { ChambreDetailComponent } from '../detail/chambre-detail.component';
import { ChambreUpdateComponent } from '../update/chambre-update.component';
import { ChambreRoutingResolveService } from './chambre-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const chambreRoute: Routes = [
  {
    path: '',
    component: ChambreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChambreDetailComponent,
    resolve: {
      chambre: ChambreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChambreUpdateComponent,
    resolve: {
      chambre: ChambreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChambreUpdateComponent,
    resolve: {
      chambre: ChambreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chambreRoute)],
  exports: [RouterModule],
})
export class ChambreRoutingModule {}
