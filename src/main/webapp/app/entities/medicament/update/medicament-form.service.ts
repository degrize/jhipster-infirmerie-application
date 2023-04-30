import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMedicament, NewMedicament } from '../medicament.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedicament for edit and NewMedicamentFormGroupInput for create.
 */
type MedicamentFormGroupInput = IMedicament | PartialWithRequiredKeyOf<NewMedicament>;

type MedicamentFormDefaults = Pick<NewMedicament, 'id'>;

type MedicamentFormGroupContent = {
  id: FormControl<IMedicament['id'] | NewMedicament['id']>;
  medicament: FormControl<IMedicament['medicament']>;
  typeMedicament: FormControl<IMedicament['typeMedicament']>;
  ordonnance: FormControl<IMedicament['ordonnance']>;
};

export type MedicamentFormGroup = FormGroup<MedicamentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MedicamentFormService {
  createMedicamentFormGroup(medicament: MedicamentFormGroupInput = { id: null }): MedicamentFormGroup {
    const medicamentRawValue = {
      ...this.getFormDefaults(),
      ...medicament,
    };
    return new FormGroup<MedicamentFormGroupContent>({
      id: new FormControl(
        { value: medicamentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      medicament: new FormControl(medicamentRawValue.medicament),
      typeMedicament: new FormControl(medicamentRawValue.typeMedicament),
      ordonnance: new FormControl(medicamentRawValue.ordonnance),
    });
  }

  getMedicament(form: MedicamentFormGroup): IMedicament | NewMedicament {
    return form.getRawValue() as IMedicament | NewMedicament;
  }

  resetForm(form: MedicamentFormGroup, medicament: MedicamentFormGroupInput): void {
    const medicamentRawValue = { ...this.getFormDefaults(), ...medicament };
    form.reset(
      {
        ...medicamentRawValue,
        id: { value: medicamentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MedicamentFormDefaults {
    return {
      id: null,
    };
  }
}
