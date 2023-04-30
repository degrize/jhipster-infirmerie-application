import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConstanteComponent } from './list/constante.component';
import { ConstanteDetailComponent } from './detail/constante-detail.component';
import { ConstanteUpdateComponent } from './update/constante-update.component';
import { ConstanteDeleteDialogComponent } from './delete/constante-delete-dialog.component';
import { ConstanteRoutingModule } from './route/constante-routing.module';

@NgModule({
  imports: [SharedModule, ConstanteRoutingModule],
  declarations: [ConstanteComponent, ConstanteDetailComponent, ConstanteUpdateComponent, ConstanteDeleteDialogComponent],
})
export class ConstanteModule {}
