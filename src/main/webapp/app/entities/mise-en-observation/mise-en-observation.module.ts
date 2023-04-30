import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MiseEnObservationComponent } from './list/mise-en-observation.component';
import { MiseEnObservationDetailComponent } from './detail/mise-en-observation-detail.component';
import { MiseEnObservationUpdateComponent } from './update/mise-en-observation-update.component';
import { MiseEnObservationDeleteDialogComponent } from './delete/mise-en-observation-delete-dialog.component';
import { MiseEnObservationRoutingModule } from './route/mise-en-observation-routing.module';

@NgModule({
  imports: [SharedModule, MiseEnObservationRoutingModule],
  declarations: [
    MiseEnObservationComponent,
    MiseEnObservationDetailComponent,
    MiseEnObservationUpdateComponent,
    MiseEnObservationDeleteDialogComponent,
  ],
})
export class MiseEnObservationModule {}
