import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConstante, NewConstante } from '../constante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConstante for edit and NewConstanteFormGroupInput for create.
 */
type ConstanteFormGroupInput = IConstante | PartialWithRequiredKeyOf<NewConstante>;

type ConstanteFormDefaults = Pick<NewConstante, 'id'>;

type ConstanteFormGroupContent = {
  id: FormControl<IConstante['id'] | NewConstante['id']>;
  masse: FormControl<IConstante['masse']>;
  temperature: FormControl<IConstante['temperature']>;
  taille: FormControl<IConstante['taille']>;
  pouls: FormControl<IConstante['pouls']>;
};

export type ConstanteFormGroup = FormGroup<ConstanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConstanteFormService {
  createConstanteFormGroup(constante: ConstanteFormGroupInput = { id: null }): ConstanteFormGroup {
    const constanteRawValue = {
      ...this.getFormDefaults(),
      ...constante,
    };
    return new FormGroup<ConstanteFormGroupContent>({
      id: new FormControl(
        { value: constanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      masse: new FormControl(constanteRawValue.masse),
      temperature: new FormControl(constanteRawValue.temperature),
      taille: new FormControl(constanteRawValue.taille),
      pouls: new FormControl(constanteRawValue.pouls),
    });
  }

  getConstante(form: ConstanteFormGroup): IConstante | NewConstante {
    return form.getRawValue() as IConstante | NewConstante;
  }

  resetForm(form: ConstanteFormGroup, constante: ConstanteFormGroupInput): void {
    const constanteRawValue = { ...this.getFormDefaults(), ...constante };
    form.reset(
      {
        ...constanteRawValue,
        id: { value: constanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConstanteFormDefaults {
    return {
      id: null,
    };
  }
}
