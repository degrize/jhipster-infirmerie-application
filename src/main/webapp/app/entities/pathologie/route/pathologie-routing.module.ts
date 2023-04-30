import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PathologieComponent } from '../list/pathologie.component';
import { PathologieDetailComponent } from '../detail/pathologie-detail.component';
import { PathologieUpdateComponent } from '../update/pathologie-update.component';
import { PathologieRoutingResolveService } from './pathologie-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pathologieRoute: Routes = [
  {
    path: '',
    component: PathologieComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PathologieDetailComponent,
    resolve: {
      pathologie: PathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PathologieUpdateComponent,
    resolve: {
      pathologie: PathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PathologieUpdateComponent,
    resolve: {
      pathologie: PathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pathologieRoute)],
  exports: [RouterModule],
})
export class PathologieRoutingModule {}
