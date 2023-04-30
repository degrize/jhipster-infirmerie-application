import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AgentSanteComponent } from '../list/agent-sante.component';
import { AgentSanteDetailComponent } from '../detail/agent-sante-detail.component';
import { AgentSanteUpdateComponent } from '../update/agent-sante-update.component';
import { AgentSanteRoutingResolveService } from './agent-sante-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const agentSanteRoute: Routes = [
  {
    path: '',
    component: AgentSanteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgentSanteDetailComponent,
    resolve: {
      agentSante: AgentSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgentSanteUpdateComponent,
    resolve: {
      agentSante: AgentSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgentSanteUpdateComponent,
    resolve: {
      agentSante: AgentSanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(agentSanteRoute)],
  exports: [RouterModule],
})
export class AgentSanteRoutingModule {}
