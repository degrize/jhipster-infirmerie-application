import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrdonnanceComponent } from '../list/ordonnance.component';
import { OrdonnanceDetailComponent } from '../detail/ordonnance-detail.component';
import { OrdonnanceUpdateComponent } from '../update/ordonnance-update.component';
import { OrdonnanceRoutingResolveService } from './ordonnance-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ordonnanceRoute: Routes = [
  {
    path: '',
    component: OrdonnanceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrdonnanceDetailComponent,
    resolve: {
      ordonnance: OrdonnanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrdonnanceUpdateComponent,
    resolve: {
      ordonnance: OrdonnanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrdonnanceUpdateComponent,
    resolve: {
      ordonnance: OrdonnanceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ordonnanceRoute)],
  exports: [RouterModule],
})
export class OrdonnanceRoutingModule {}
