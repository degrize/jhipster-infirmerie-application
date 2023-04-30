import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EcoleComponent } from '../list/ecole.component';
import { EcoleDetailComponent } from '../detail/ecole-detail.component';
import { EcoleUpdateComponent } from '../update/ecole-update.component';
import { EcoleRoutingResolveService } from './ecole-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ecoleRoute: Routes = [
  {
    path: '',
    component: EcoleComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EcoleDetailComponent,
    resolve: {
      ecole: EcoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EcoleUpdateComponent,
    resolve: {
      ecole: EcoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EcoleUpdateComponent,
    resolve: {
      ecole: EcoleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ecoleRoute)],
  exports: [RouterModule],
})
export class EcoleRoutingModule {}
