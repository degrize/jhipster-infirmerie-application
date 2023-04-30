import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PathologieComponent } from './list/pathologie.component';
import { PathologieDetailComponent } from './detail/pathologie-detail.component';
import { PathologieUpdateComponent } from './update/pathologie-update.component';
import { PathologieDeleteDialogComponent } from './delete/pathologie-delete-dialog.component';
import { PathologieRoutingModule } from './route/pathologie-routing.module';

@NgModule({
  imports: [SharedModule, PathologieRoutingModule],
  declarations: [PathologieComponent, PathologieDetailComponent, PathologieUpdateComponent, PathologieDeleteDialogComponent],
})
export class PathologieModule {}
