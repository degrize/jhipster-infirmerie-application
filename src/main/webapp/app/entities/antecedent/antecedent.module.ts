import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AntecedentComponent } from './list/antecedent.component';
import { AntecedentDetailComponent } from './detail/antecedent-detail.component';
import { AntecedentUpdateComponent } from './update/antecedent-update.component';
import { AntecedentDeleteDialogComponent } from './delete/antecedent-delete-dialog.component';
import { AntecedentRoutingModule } from './route/antecedent-routing.module';

@NgModule({
  imports: [SharedModule, AntecedentRoutingModule],
  declarations: [AntecedentComponent, AntecedentDetailComponent, AntecedentUpdateComponent, AntecedentDeleteDialogComponent],
})
export class AntecedentModule {}
