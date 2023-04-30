import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeAgentComponent } from './list/type-agent.component';
import { TypeAgentDetailComponent } from './detail/type-agent-detail.component';
import { TypeAgentUpdateComponent } from './update/type-agent-update.component';
import { TypeAgentDeleteDialogComponent } from './delete/type-agent-delete-dialog.component';
import { TypeAgentRoutingModule } from './route/type-agent-routing.module';

@NgModule({
  imports: [SharedModule, TypeAgentRoutingModule],
  declarations: [TypeAgentComponent, TypeAgentDetailComponent, TypeAgentUpdateComponent, TypeAgentDeleteDialogComponent],
})
export class TypeAgentModule {}
