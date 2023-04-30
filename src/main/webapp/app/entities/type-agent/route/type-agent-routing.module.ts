import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeAgentComponent } from '../list/type-agent.component';
import { TypeAgentDetailComponent } from '../detail/type-agent-detail.component';
import { TypeAgentUpdateComponent } from '../update/type-agent-update.component';
import { TypeAgentRoutingResolveService } from './type-agent-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const typeAgentRoute: Routes = [
  {
    path: '',
    component: TypeAgentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeAgentDetailComponent,
    resolve: {
      typeAgent: TypeAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeAgentUpdateComponent,
    resolve: {
      typeAgent: TypeAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeAgentUpdateComponent,
    resolve: {
      typeAgent: TypeAgentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeAgentRoute)],
  exports: [RouterModule],
})
export class TypeAgentRoutingModule {}
