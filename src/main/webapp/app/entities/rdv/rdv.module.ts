import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RdvComponent } from './list/rdv.component';
import { RdvDetailComponent } from './detail/rdv-detail.component';
import { RdvUpdateComponent } from './update/rdv-update.component';
import { RdvDeleteDialogComponent } from './delete/rdv-delete-dialog.component';
import { RdvRoutingModule } from './route/rdv-routing.module';

@NgModule({
  imports: [SharedModule, RdvRoutingModule],
  declarations: [RdvComponent, RdvDetailComponent, RdvUpdateComponent, RdvDeleteDialogComponent],
})
export class RdvModule {}
