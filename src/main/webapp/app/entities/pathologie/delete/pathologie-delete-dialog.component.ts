import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPathologie } from '../pathologie.model';
import { PathologieService } from '../service/pathologie.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pathologie-delete-dialog.component.html',
})
export class PathologieDeleteDialogComponent {
  pathologie?: IPathologie;

  constructor(protected pathologieService: PathologieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pathologieService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
