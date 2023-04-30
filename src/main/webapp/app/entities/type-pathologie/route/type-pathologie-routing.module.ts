import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypePathologieComponent } from '../list/type-pathologie.component';
import { TypePathologieDetailComponent } from '../detail/type-pathologie-detail.component';
import { TypePathologieUpdateComponent } from '../update/type-pathologie-update.component';
import { TypePathologieRoutingResolveService } from './type-pathologie-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const typePathologieRoute: Routes = [
  {
    path: '',
    component: TypePathologieComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypePathologieDetailComponent,
    resolve: {
      typePathologie: TypePathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypePathologieUpdateComponent,
    resolve: {
      typePathologie: TypePathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypePathologieUpdateComponent,
    resolve: {
      typePathologie: TypePathologieRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typePathologieRoute)],
  exports: [RouterModule],
})
export class TypePathologieRoutingModule {}
