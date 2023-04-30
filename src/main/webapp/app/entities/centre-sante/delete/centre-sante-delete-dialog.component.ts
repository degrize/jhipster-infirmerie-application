import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICentreSante } from '../centre-sante.model';
import { CentreSanteService } from '../service/centre-sante.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './centre-sante-delete-dialog.component.html',
})
export class CentreSanteDeleteDialogComponent {
  centreSante?: ICentreSante;

  constructor(protected centreSanteService: CentreSanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.centreSanteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
