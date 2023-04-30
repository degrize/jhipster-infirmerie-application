import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrdonnance } from '../ordonnance.model';
import { OrdonnanceService } from '../service/ordonnance.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ordonnance-delete-dialog.component.html',
})
export class OrdonnanceDeleteDialogComponent {
  ordonnance?: IOrdonnance;

  constructor(protected ordonnanceService: OrdonnanceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ordonnanceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
