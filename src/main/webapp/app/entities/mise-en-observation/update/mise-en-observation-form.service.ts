import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMiseEnObservation, NewMiseEnObservation } from '../mise-en-observation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMiseEnObservation for edit and NewMiseEnObservationFormGroupInput for create.
 */
type MiseEnObservationFormGroupInput = IMiseEnObservation | PartialWithRequiredKeyOf<NewMiseEnObservation>;

type MiseEnObservationFormDefaults = Pick<NewMiseEnObservation, 'id'>;

type MiseEnObservationFormGroupContent = {
  id: FormControl<IMiseEnObservation['id'] | NewMiseEnObservation['id']>;
  dateDebut: FormControl<IMiseEnObservation['dateDebut']>;
  dateFin: FormControl<IMiseEnObservation['dateFin']>;
  description: FormControl<IMiseEnObservation['description']>;
  miseEnObservation: FormControl<IMiseEnObservation['miseEnObservation']>;
};

export type MiseEnObservationFormGroup = FormGroup<MiseEnObservationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MiseEnObservationFormService {
  createMiseEnObservationFormGroup(miseEnObservation: MiseEnObservationFormGroupInput = { id: null }): MiseEnObservationFormGroup {
    const miseEnObservationRawValue = {
      ...this.getFormDefaults(),
      ...miseEnObservation,
    };
    return new FormGroup<MiseEnObservationFormGroupContent>({
      id: new FormControl(
        { value: miseEnObservationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateDebut: new FormControl(miseEnObservationRawValue.dateDebut),
      dateFin: new FormControl(miseEnObservationRawValue.dateFin),
      description: new FormControl(miseEnObservationRawValue.description),
      miseEnObservation: new FormControl(miseEnObservationRawValue.miseEnObservation),
    });
  }

  getMiseEnObservation(form: MiseEnObservationFormGroup): IMiseEnObservation | NewMiseEnObservation {
    return form.getRawValue() as IMiseEnObservation | NewMiseEnObservation;
  }

  resetForm(form: MiseEnObservationFormGroup, miseEnObservation: MiseEnObservationFormGroupInput): void {
    const miseEnObservationRawValue = { ...this.getFormDefaults(), ...miseEnObservation };
    form.reset(
      {
        ...miseEnObservationRawValue,
        id: { value: miseEnObservationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MiseEnObservationFormDefaults {
    return {
      id: null,
    };
  }
}
