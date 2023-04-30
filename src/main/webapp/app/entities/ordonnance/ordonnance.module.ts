import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OrdonnanceComponent } from './list/ordonnance.component';
import { OrdonnanceDetailComponent } from './detail/ordonnance-detail.component';
import { OrdonnanceUpdateComponent } from './update/ordonnance-update.component';
import { OrdonnanceDeleteDialogComponent } from './delete/ordonnance-delete-dialog.component';
import { OrdonnanceRoutingModule } from './route/ordonnance-routing.module';

@NgModule({
  imports: [SharedModule, OrdonnanceRoutingModule],
  declarations: [OrdonnanceComponent, OrdonnanceDetailComponent, OrdonnanceUpdateComponent, OrdonnanceDeleteDialogComponent],
})
export class OrdonnanceModule {}
