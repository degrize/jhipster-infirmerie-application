import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CentreSanteComponent } from '../list/centre-sante.component';
import { CentreSanteDetailComponent } from '../detail/centre-sante-detail.component';
import { CentreSanteUpdateComponent } from '../update/centre-sante-update.component';
import { CentreSanteRoutingResolveService } from './centre-sante-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const centreSanteRoute: Routes = [
  {
    path: '',
    component: CentreSanteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CentreSanteDetailComponent,
    resolve: {
      centreSante: CentreSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CentreSanteUpdateComponent,
    resolve: {
      centreSante: CentreSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CentreSanteUpdateComponent,
    resolve: {
      centreSante: CentreSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(centreSanteRoute)],
  exports: [RouterModule],
})
export class CentreSanteRoutingModule {}
