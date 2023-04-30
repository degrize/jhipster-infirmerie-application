import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypePathologieComponent } from './list/type-pathologie.component';
import { TypePathologieDetailComponent } from './detail/type-pathologie-detail.component';
import { TypePathologieUpdateComponent } from './update/type-pathologie-update.component';
import { TypePathologieDeleteDialogComponent } from './delete/type-pathologie-delete-dialog.component';
import { TypePathologieRoutingModule } from './route/type-pathologie-routing.module';

@NgModule({
  imports: [SharedModule, TypePathologieRoutingModule],
  declarations: [
    TypePathologieComponent,
    TypePathologieDetailComponent,
    TypePathologieUpdateComponent,
    TypePathologieDeleteDialogComponent,
  ],
})
export class TypePathologieModule {}
