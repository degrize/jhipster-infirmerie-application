import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeConsultation } from '../type-consultation.model';
import { TypeConsultationService } from '../service/type-consultation.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './type-consultation-delete-dialog.component.html',
})
export class TypeConsultationDeleteDialogComponent {
  typeConsultation?: ITypeConsultation;

  constructor(protected typeConsultationService: TypeConsultationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeConsultationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
