import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeAgent } from '../type-agent.model';
import { TypeAgentService } from '../service/type-agent.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './type-agent-delete-dialog.component.html',
})
export class TypeAgentDeleteDialogComponent {
  typeAgent?: ITypeAgent;

  constructor(protected typeAgentService: TypeAgentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeAgentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
