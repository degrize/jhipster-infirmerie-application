import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChambreComponent } from './list/chambre.component';
import { ChambreDetailComponent } from './detail/chambre-detail.component';
import { ChambreUpdateComponent } from './update/chambre-update.component';
import { ChambreDeleteDialogComponent } from './delete/chambre-delete-dialog.component';
import { ChambreRoutingModule } from './route/chambre-routing.module';

@NgModule({
  imports: [SharedModule, ChambreRoutingModule],
  declarations: [ChambreComponent, ChambreDetailComponent, ChambreUpdateComponent, ChambreDeleteDialogComponent],
})
export class ChambreModule {}
