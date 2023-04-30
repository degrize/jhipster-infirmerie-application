import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EcoleComponent } from './list/ecole.component';
import { EcoleDetailComponent } from './detail/ecole-detail.component';
import { EcoleUpdateComponent } from './update/ecole-update.component';
import { EcoleDeleteDialogComponent } from './delete/ecole-delete-dialog.component';
import { EcoleRoutingModule } from './route/ecole-routing.module';

@NgModule({
  imports: [SharedModule, EcoleRoutingModule],
  declarations: [EcoleComponent, EcoleDetailComponent, EcoleUpdateComponent, EcoleDeleteDialogComponent],
})
export class EcoleModule {}
