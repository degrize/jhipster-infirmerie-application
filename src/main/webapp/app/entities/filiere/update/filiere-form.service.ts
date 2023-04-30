import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFiliere, NewFiliere } from '../filiere.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFiliere for edit and NewFiliereFormGroupInput for create.
 */
type FiliereFormGroupInput = IFiliere | PartialWithRequiredKeyOf<NewFiliere>;

type FiliereFormDefaults = Pick<NewFiliere, 'id'>;

type FiliereFormGroupContent = {
  id: FormControl<IFiliere['id'] | NewFiliere['id']>;
  nom: FormControl<IFiliere['nom']>;
  cycle: FormControl<IFiliere['cycle']>;
  classe: FormControl<IFiliere['classe']>;
  ecole: FormControl<IFiliere['ecole']>;
};

export type FiliereFormGroup = FormGroup<FiliereFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FiliereFormService {
  createFiliereFormGroup(filiere: FiliereFormGroupInput = { id: null }): FiliereFormGroup {
    const filiereRawValue = {
      ...this.getFormDefaults(),
      ...filiere,
    };
    return new FormGroup<FiliereFormGroupContent>({
      id: new FormControl(
        { value: filiereRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(filiereRawValue.nom),
      cycle: new FormControl(filiereRawValue.cycle),
      classe: new FormControl(filiereRawValue.classe),
      ecole: new FormControl(filiereRawValue.ecole),
    });
  }

  getFiliere(form: FiliereFormGroup): IFiliere | NewFiliere {
    return form.getRawValue() as IFiliere | NewFiliere;
  }

  resetForm(form: FiliereFormGroup, filiere: FiliereFormGroupInput): void {
    const filiereRawValue = { ...this.getFormDefaults(), ...filiere };
    form.reset(
      {
        ...filiereRawValue,
        id: { value: filiereRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FiliereFormDefaults {
    return {
      id: null,
    };
  }
}
