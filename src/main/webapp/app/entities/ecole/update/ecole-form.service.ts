import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEcole, NewEcole } from '../ecole.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEcole for edit and NewEcoleFormGroupInput for create.
 */
type EcoleFormGroupInput = IEcole | PartialWithRequiredKeyOf<NewEcole>;

type EcoleFormDefaults = Pick<NewEcole, 'id'>;

type EcoleFormGroupContent = {
  id: FormControl<IEcole['id'] | NewEcole['id']>;
  nom: FormControl<IEcole['nom']>;
};

export type EcoleFormGroup = FormGroup<EcoleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EcoleFormService {
  createEcoleFormGroup(ecole: EcoleFormGroupInput = { id: null }): EcoleFormGroup {
    const ecoleRawValue = {
      ...this.getFormDefaults(),
      ...ecole,
    };
    return new FormGroup<EcoleFormGroupContent>({
      id: new FormControl(
        { value: ecoleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(ecoleRawValue.nom),
    });
  }

  getEcole(form: EcoleFormGroup): IEcole | NewEcole {
    return form.getRawValue() as IEcole | NewEcole;
  }

  resetForm(form: EcoleFormGroup, ecole: EcoleFormGroupInput): void {
    const ecoleRawValue = { ...this.getFormDefaults(), ...ecole };
    form.reset(
      {
        ...ecoleRawValue,
        id: { value: ecoleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EcoleFormDefaults {
    return {
      id: null,
    };
  }
}
