import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRdv, NewRdv } from '../rdv.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRdv for edit and NewRdvFormGroupInput for create.
 */
type RdvFormGroupInput = IRdv | PartialWithRequiredKeyOf<NewRdv>;

type RdvFormDefaults = Pick<NewRdv, 'id'>;

type RdvFormGroupContent = {
  id: FormControl<IRdv['id'] | NewRdv['id']>;
  dateRdv: FormControl<IRdv['dateRdv']>;
  motif: FormControl<IRdv['motif']>;
  consultation: FormControl<IRdv['consultation']>;
};

export type RdvFormGroup = FormGroup<RdvFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RdvFormService {
  createRdvFormGroup(rdv: RdvFormGroupInput = { id: null }): RdvFormGroup {
    const rdvRawValue = {
      ...this.getFormDefaults(),
      ...rdv,
    };
    return new FormGroup<RdvFormGroupContent>({
      id: new FormControl(
        { value: rdvRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateRdv: new FormControl(rdvRawValue.dateRdv),
      motif: new FormControl(rdvRawValue.motif),
      consultation: new FormControl(rdvRawValue.consultation),
    });
  }

  getRdv(form: RdvFormGroup): IRdv | NewRdv {
    return form.getRawValue() as IRdv | NewRdv;
  }

  resetForm(form: RdvFormGroup, rdv: RdvFormGroupInput): void {
    const rdvRawValue = { ...this.getFormDefaults(), ...rdv };
    form.reset(
      {
        ...rdvRawValue,
        id: { value: rdvRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RdvFormDefaults {
    return {
      id: null,
    };
  }
}
