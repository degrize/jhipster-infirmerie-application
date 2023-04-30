import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeConsultationComponent } from './list/type-consultation.component';
import { TypeConsultationDetailComponent } from './detail/type-consultation-detail.component';
import { TypeConsultationUpdateComponent } from './update/type-consultation-update.component';
import { TypeConsultationDeleteDialogComponent } from './delete/type-consultation-delete-dialog.component';
import { TypeConsultationRoutingModule } from './route/type-consultation-routing.module';

@NgModule({
  imports: [SharedModule, TypeConsultationRoutingModule],
  declarations: [
    TypeConsultationComponent,
    TypeConsultationDetailComponent,
    TypeConsultationUpdateComponent,
    TypeConsultationDeleteDialogComponent,
  ],
})
export class TypeConsultationModule {}
