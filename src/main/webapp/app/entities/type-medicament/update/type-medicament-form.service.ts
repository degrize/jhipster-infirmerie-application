import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITypeMedicament, NewTypeMedicament } from '../type-medicament.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypeMedicament for edit and NewTypeMedicamentFormGroupInput for create.
 */
type TypeMedicamentFormGroupInput = ITypeMedicament | PartialWithRequiredKeyOf<NewTypeMedicament>;

type TypeMedicamentFormDefaults = Pick<NewTypeMedicament, 'id'>;

type TypeMedicamentFormGroupContent = {
  id: FormControl<ITypeMedicament['id'] | NewTypeMedicament['id']>;
  typeMedicament: FormControl<ITypeMedicament['typeMedicament']>;
};

export type TypeMedicamentFormGroup = FormGroup<TypeMedicamentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeMedicamentFormService {
  createTypeMedicamentFormGroup(typeMedicament: TypeMedicamentFormGroupInput = { id: null }): TypeMedicamentFormGroup {
    const typeMedicamentRawValue = {
      ...this.getFormDefaults(),
      ...typeMedicament,
    };
    return new FormGroup<TypeMedicamentFormGroupContent>({
      id: new FormControl(
        { value: typeMedicamentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      typeMedicament: new FormControl(typeMedicamentRawValue.typeMedicament),
    });
  }

  getTypeMedicament(form: TypeMedicamentFormGroup): ITypeMedicament | NewTypeMedicament {
    return form.getRawValue() as ITypeMedicament | NewTypeMedicament;
  }

  resetForm(form: TypeMedicamentFormGroup, typeMedicament: TypeMedicamentFormGroupInput): void {
    const typeMedicamentRawValue = { ...this.getFormDefaults(), ...typeMedicament };
    form.reset(
      {
        ...typeMedicamentRawValue,
        id: { value: typeMedicamentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TypeMedicamentFormDefaults {
    return {
      id: null,
    };
  }
}
