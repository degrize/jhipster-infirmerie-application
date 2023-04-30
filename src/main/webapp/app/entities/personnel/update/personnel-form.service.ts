import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPersonnel, NewPersonnel } from '../personnel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPersonnel for edit and NewPersonnelFormGroupInput for create.
 */
type PersonnelFormGroupInput = IPersonnel | PartialWithRequiredKeyOf<NewPersonnel>;

type PersonnelFormDefaults = Pick<NewPersonnel, 'id'>;

type PersonnelFormGroupContent = {
  id: FormControl<IPersonnel['id'] | NewPersonnel['id']>;
  matricule: FormControl<IPersonnel['matricule']>;
  patient: FormControl<IPersonnel['patient']>;
  service: FormControl<IPersonnel['service']>;
};

export type PersonnelFormGroup = FormGroup<PersonnelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonnelFormService {
  createPersonnelFormGroup(personnel: PersonnelFormGroupInput = { id: null }): PersonnelFormGroup {
    const personnelRawValue = {
      ...this.getFormDefaults(),
      ...personnel,
    };
    return new FormGroup<PersonnelFormGroupContent>({
      id: new FormControl(
        { value: personnelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      matricule: new FormControl(personnelRawValue.matricule),
      patient: new FormControl(personnelRawValue.patient),
      service: new FormControl(personnelRawValue.service),
    });
  }

  getPersonnel(form: PersonnelFormGroup): IPersonnel | NewPersonnel {
    return form.getRawValue() as IPersonnel | NewPersonnel;
  }

  resetForm(form: PersonnelFormGroup, personnel: PersonnelFormGroupInput): void {
    const personnelRawValue = { ...this.getFormDefaults(), ...personnel };
    form.reset(
      {
        ...personnelRawValue,
        id: { value: personnelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PersonnelFormDefaults {
    return {
      id: null,
    };
  }
}
