import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypePathologie } from '../type-pathologie.model';
import { TypePathologieService } from '../service/type-pathologie.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './type-pathologie-delete-dialog.component.html',
})
export class TypePathologieDeleteDialogComponent {
  typePathologie?: ITypePathologie;

  constructor(protected typePathologieService: TypePathologieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.typePathologieService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
