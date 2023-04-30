import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TypeMedicamentComponent } from '../list/type-medicament.component';
import { TypeMedicamentDetailComponent } from '../detail/type-medicament-detail.component';
import { TypeMedicamentUpdateComponent } from '../update/type-medicament-update.component';
import { TypeMedicamentRoutingResolveService } from './type-medicament-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const typeMedicamentRoute: Routes = [
  {
    path: '',
    component: TypeMedicamentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TypeMedicamentDetailComponent,
    resolve: {
      typeMedicament: TypeMedicamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TypeMedicamentUpdateComponent,
    resolve: {
      typeMedicament: TypeMedicamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TypeMedicamentUpdateComponent,
    resolve: {
      typeMedicament: TypeMedicamentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(typeMedicamentRoute)],
  exports: [RouterModule],
})
export class TypeMedicamentRoutingModule {}
