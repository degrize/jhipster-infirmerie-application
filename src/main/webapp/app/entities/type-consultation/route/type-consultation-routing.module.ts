import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeConsultationComponent } from '../list/type-consultation.component';
import { TypeConsultationDetailComponent } from '../detail/type-consultation-detail.component';
import { TypeConsultationUpdateComponent } from '../update/type-consultation-update.component';
import { TypeConsultationRoutingResolveService } from './type-consultation-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const typeConsultationRoute: Routes = [
  {
    path: '',
    component: TypeConsultationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeConsultationDetailComponent,
    resolve: {
      typeConsultation: TypeConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeConsultationUpdateComponent,
    resolve: {
      typeConsultation: TypeConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeConsultationUpdateComponent,
    resolve: {
      typeConsultation: TypeConsultationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeConsultationRoute)],
  exports: [RouterModule],
})
export class TypeConsultationRoutingModule {}
