import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITypeConsultation, NewTypeConsultation } from '../type-consultation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypeConsultation for edit and NewTypeConsultationFormGroupInput for create.
 */
type TypeConsultationFormGroupInput = ITypeConsultation | PartialWithRequiredKeyOf<NewTypeConsultation>;

type TypeConsultationFormDefaults = Pick<NewTypeConsultation, 'id'>;

type TypeConsultationFormGroupContent = {
  id: FormControl<ITypeConsultation['id'] | NewTypeConsultation['id']>;
  libelleTypeConsultation: FormControl<ITypeConsultation['libelleTypeConsultation']>;
};

export type TypeConsultationFormGroup = FormGroup<TypeConsultationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeConsultationFormService {
  createTypeConsultationFormGroup(typeConsultation: TypeConsultationFormGroupInput = { id: null }): TypeConsultationFormGroup {
    const typeConsultationRawValue = {
      ...this.getFormDefaults(),
      ...typeConsultation,
    };
    return new FormGroup<TypeConsultationFormGroupContent>({
      id: new FormControl(
        { value: typeConsultationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libelleTypeConsultation: new FormControl(typeConsultationRawValue.libelleTypeConsultation),
    });
  }

  getTypeConsultation(form: TypeConsultationFormGroup): ITypeConsultation | NewTypeConsultation {
    return form.getRawValue() as ITypeConsultation | NewTypeConsultation;
  }

  resetForm(form: TypeConsultationFormGroup, typeConsultation: TypeConsultationFormGroupInput): void {
    const typeConsultationRawValue = { ...this.getFormDefaults(), ...typeConsultation };
    form.reset(
      {
        ...typeConsultationRawValue,
        id: { value: typeConsultationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TypeConsultationFormDefaults {
    return {
      id: null,
    };
  }
}
