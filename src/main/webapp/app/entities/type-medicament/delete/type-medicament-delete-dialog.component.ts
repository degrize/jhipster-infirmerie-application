import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeMedicament } from '../type-medicament.model';
import { TypeMedicamentService } from '../service/type-medicament.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './type-medicament-delete-dialog.component.html',
})
export class TypeMedicamentDeleteDialogComponent {
  typeMedicament?: ITypeMedicament;

  constructor(protected typeMedicamentService: TypeMedicamentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typeMedicamentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
