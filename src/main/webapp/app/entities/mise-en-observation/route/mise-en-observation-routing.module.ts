import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MiseEnObservationComponent } from '../list/mise-en-observation.component';
import { MiseEnObservationDetailComponent } from '../detail/mise-en-observation-detail.component';
import { MiseEnObservationUpdateComponent } from '../update/mise-en-observation-update.component';
import { MiseEnObservationRoutingResolveService } from './mise-en-observation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const miseEnObservationRoute: Routes = [
  {
    path: '',
    component: MiseEnObservationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MiseEnObservationDetailComponent,
    resolve: {
      miseEnObservation: MiseEnObservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MiseEnObservationUpdateComponent,
    resolve: {
      miseEnObservation: MiseEnObservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MiseEnObservationUpdateComponent,
    resolve: {
      miseEnObservation: MiseEnObservationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(miseEnObservationRoute)],
  exports: [RouterModule],
})
export class MiseEnObservationRoutingModule {}
