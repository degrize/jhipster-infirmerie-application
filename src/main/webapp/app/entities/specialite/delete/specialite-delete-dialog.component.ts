import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISpecialite } from '../specialite.model';
import { SpecialiteService } from '../service/specialite.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './specialite-delete-dialog.component.html',
})
export class SpecialiteDeleteDialogComponent {
  specialite?: ISpecialite;

  constructor(protected specialiteService: SpecialiteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.specialiteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
