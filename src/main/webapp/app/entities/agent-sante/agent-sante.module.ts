import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AgentSanteComponent } from './list/agent-sante.component';
import { AgentSanteDetailComponent } from './detail/agent-sante-detail.component';
import { AgentSanteUpdateComponent } from './update/agent-sante-update.component';
import { AgentSanteDeleteDialogComponent } from './delete/agent-sante-delete-dialog.component';
import { AgentSanteRoutingModule } from './route/agent-sante-routing.module';

@NgModule({
  imports: [SharedModule, AgentSanteRoutingModule],
  declarations: [AgentSanteComponent, AgentSanteDetailComponent, AgentSanteUpdateComponent, AgentSanteDeleteDialogComponent],
})
export class AgentSanteModule {}
