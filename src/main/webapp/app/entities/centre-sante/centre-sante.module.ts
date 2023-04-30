import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CentreSanteComponent } from './list/centre-sante.component';
import { CentreSanteDetailComponent } from './detail/centre-sante-detail.component';
import { CentreSanteUpdateComponent } from './update/centre-sante-update.component';
import { CentreSanteDeleteDialogComponent } from './delete/centre-sante-delete-dialog.component';
import { CentreSanteRoutingModule } from './route/centre-sante-routing.module';

@NgModule({
  imports: [SharedModule, CentreSanteRoutingModule],
  declarations: [CentreSanteComponent, CentreSanteDetailComponent, CentreSanteUpdateComponent, CentreSanteDeleteDialogComponent],
})
export class CentreSanteModule {}
