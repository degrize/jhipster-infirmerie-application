import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgentSante } from '../agent-sante.model';
import { AgentSanteService } from '../service/agent-sante.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './agent-sante-delete-dialog.component.html',
})
export class AgentSanteDeleteDialogComponent {
  agentSante?: IAgentSante;

  constructor(protected agentSanteService: AgentSanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agentSanteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
