import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMiseEnObservation } from '../mise-en-observation.model';
import { MiseEnObservationService } from '../service/mise-en-observation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mise-en-observation-delete-dialog.component.html',
})
export class MiseEnObservationDeleteDialogComponent {
  miseEnObservation?: IMiseEnObservation;

  constructor(protected miseEnObservationService: MiseEnObservationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.miseEnObservationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
