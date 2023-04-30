import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAntecedent, NewAntecedent } from '../antecedent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAntecedent for edit and NewAntecedentFormGroupInput for create.
 */
type AntecedentFormGroupInput = IAntecedent | PartialWithRequiredKeyOf<NewAntecedent>;

type AntecedentFormDefaults = Pick<NewAntecedent, 'id'>;

type AntecedentFormGroupContent = {
  id: FormControl<IAntecedent['id'] | NewAntecedent['id']>;
  libAntecedent: FormControl<IAntecedent['libAntecedent']>;
  patient: FormControl<IAntecedent['patient']>;
};

export type AntecedentFormGroup = FormGroup<AntecedentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AntecedentFormService {
  createAntecedentFormGroup(antecedent: AntecedentFormGroupInput = { id: null }): AntecedentFormGroup {
    const antecedentRawValue = {
      ...this.getFormDefaults(),
      ...antecedent,
    };
    return new FormGroup<AntecedentFormGroupContent>({
      id: new FormControl(
        { value: antecedentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libAntecedent: new FormControl(antecedentRawValue.libAntecedent),
      patient: new FormControl(antecedentRawValue.patient),
    });
  }

  getAntecedent(form: AntecedentFormGroup): IAntecedent | NewAntecedent {
    return form.getRawValue() as IAntecedent | NewAntecedent;
  }

  resetForm(form: AntecedentFormGroup, antecedent: AntecedentFormGroupInput): void {
    const antecedentRawValue = { ...this.getFormDefaults(), ...antecedent };
    form.reset(
      {
        ...antecedentRawValue,
        id: { value: antecedentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AntecedentFormDefaults {
    return {
      id: null,
    };
  }
}
