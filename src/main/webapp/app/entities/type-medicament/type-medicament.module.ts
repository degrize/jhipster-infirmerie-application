import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeMedicamentComponent } from './list/type-medicament.component';
import { TypeMedicamentDetailComponent } from './detail/type-medicament-detail.component';
import { TypeMedicamentUpdateComponent } from './update/type-medicament-update.component';
import { TypeMedicamentDeleteDialogComponent } from './delete/type-medicament-delete-dialog.component';
import { TypeMedicamentRoutingModule } from './route/type-medicament-routing.module';

@NgModule({
  imports: [SharedModule, TypeMedicamentRoutingModule],
  declarations: [
    TypeMedicamentComponent,
    TypeMedicamentDetailComponent,
    TypeMedicamentUpdateComponent,
    TypeMedicamentDeleteDialogComponent,
  ],
})
export class TypeMedicamentModule {}
