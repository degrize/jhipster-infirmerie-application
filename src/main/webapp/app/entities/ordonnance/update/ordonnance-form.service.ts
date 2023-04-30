import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrdonnance, NewOrdonnance } from '../ordonnance.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrdonnance for edit and NewOrdonnanceFormGroupInput for create.
 */
type OrdonnanceFormGroupInput = IOrdonnance | PartialWithRequiredKeyOf<NewOrdonnance>;

type OrdonnanceFormDefaults = Pick<NewOrdonnance, 'id'>;

type OrdonnanceFormGroupContent = {
  id: FormControl<IOrdonnance['id'] | NewOrdonnance['id']>;
  ordonnanceDescription: FormControl<IOrdonnance['ordonnanceDescription']>;
};

export type OrdonnanceFormGroup = FormGroup<OrdonnanceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrdonnanceFormService {
  createOrdonnanceFormGroup(ordonnance: OrdonnanceFormGroupInput = { id: null }): OrdonnanceFormGroup {
    const ordonnanceRawValue = {
      ...this.getFormDefaults(),
      ...ordonnance,
    };
    return new FormGroup<OrdonnanceFormGroupContent>({
      id: new FormControl(
        { value: ordonnanceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      ordonnanceDescription: new FormControl(ordonnanceRawValue.ordonnanceDescription),
    });
  }

  getOrdonnance(form: OrdonnanceFormGroup): IOrdonnance | NewOrdonnance {
    return form.getRawValue() as IOrdonnance | NewOrdonnance;
  }

  resetForm(form: OrdonnanceFormGroup, ordonnance: OrdonnanceFormGroupInput): void {
    const ordonnanceRawValue = { ...this.getFormDefaults(), ...ordonnance };
    form.reset(
      {
        ...ordonnanceRawValue,
        id: { value: ordonnanceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrdonnanceFormDefaults {
    return {
      id: null,
    };
  }
}
