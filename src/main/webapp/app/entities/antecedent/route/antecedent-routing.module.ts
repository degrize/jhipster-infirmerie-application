import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AntecedentComponent } from '../list/antecedent.component';
import { AntecedentDetailComponent } from '../detail/antecedent-detail.component';
import { AntecedentUpdateComponent } from '../update/antecedent-update.component';
import { AntecedentRoutingResolveService } from './antecedent-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const antecedentRoute: Routes = [
  {
    path: '',
    component: AntecedentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AntecedentDetailComponent,
    resolve: {
      antecedent: AntecedentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AntecedentUpdateComponent,
    resolve: {
      antecedent: AntecedentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AntecedentUpdateComponent,
    resolve: {
      antecedent: AntecedentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(antecedentRoute)],
  exports: [RouterModule],
})
export class AntecedentRoutingModule {}
