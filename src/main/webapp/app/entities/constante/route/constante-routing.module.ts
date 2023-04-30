import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConstanteComponent } from '../list/constante.component';
import { ConstanteDetailComponent } from '../detail/constante-detail.component';
import { ConstanteUpdateComponent } from '../update/constante-update.component';
import { ConstanteRoutingResolveService } from './constante-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const constanteRoute: Routes = [
  {
    path: '',
    component: ConstanteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConstanteDetailComponent,
    resolve: {
      constante: ConstanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConstanteUpdateComponent,
    resolve: {
      constante: ConstanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConstanteUpdateComponent,
    resolve: {
      constante: ConstanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(constanteRoute)],
  exports: [RouterModule],
})
export class ConstanteRoutingModule {}
