import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RdvComponent } from '../list/rdv.component';
import { RdvDetailComponent } from '../detail/rdv-detail.component';
import { RdvUpdateComponent } from '../update/rdv-update.component';
import { RdvRoutingResolveService } from './rdv-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const rdvRoute: Routes = [
  {
    path: '',
    component: RdvComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RdvDetailComponent,
    resolve: {
      rdv: RdvRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RdvUpdateComponent,
    resolve: {
      rdv: RdvRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RdvUpdateComponent,
    resolve: {
      rdv: RdvRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rdvRoute)],
  exports: [RouterModule],
})
export class RdvRoutingModule {}
