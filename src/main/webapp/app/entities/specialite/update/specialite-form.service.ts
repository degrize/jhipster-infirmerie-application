import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpecialite, NewSpecialite } from '../specialite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpecialite for edit and NewSpecialiteFormGroupInput for create.
 */
type SpecialiteFormGroupInput = ISpecialite | PartialWithRequiredKeyOf<NewSpecialite>;

type SpecialiteFormDefaults = Pick<NewSpecialite, 'id' | 'agentSantes'>;

type SpecialiteFormGroupContent = {
  id: FormControl<ISpecialite['id'] | NewSpecialite['id']>;
  specialite: FormControl<ISpecialite['specialite']>;
  agentSantes: FormControl<ISpecialite['agentSantes']>;
};

export type SpecialiteFormGroup = FormGroup<SpecialiteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpecialiteFormService {
  createSpecialiteFormGroup(specialite: SpecialiteFormGroupInput = { id: null }): SpecialiteFormGroup {
    const specialiteRawValue = {
      ...this.getFormDefaults(),
      ...specialite,
    };
    return new FormGroup<SpecialiteFormGroupContent>({
      id: new FormControl(
        { value: specialiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      specialite: new FormControl(specialiteRawValue.specialite),
      agentSantes: new FormControl(specialiteRawValue.agentSantes ?? []),
    });
  }

  getSpecialite(form: SpecialiteFormGroup): ISpecialite | NewSpecialite {
    return form.getRawValue() as ISpecialite | NewSpecialite;
  }

  resetForm(form: SpecialiteFormGroup, specialite: SpecialiteFormGroupInput): void {
    const specialiteRawValue = { ...this.getFormDefaults(), ...specialite };
    form.reset(
      {
        ...specialiteRawValue,
        id: { value: specialiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SpecialiteFormDefaults {
    return {
      id: null,
      agentSantes: [],
    };
  }
}
