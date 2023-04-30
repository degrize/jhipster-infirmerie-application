import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICentreSante, NewCentreSante } from '../centre-sante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICentreSante for edit and NewCentreSanteFormGroupInput for create.
 */
type CentreSanteFormGroupInput = ICentreSante | PartialWithRequiredKeyOf<NewCentreSante>;

type CentreSanteFormDefaults = Pick<NewCentreSante, 'id'>;

type CentreSanteFormGroupContent = {
  id: FormControl<ICentreSante['id'] | NewCentreSante['id']>;
  nom: FormControl<ICentreSante['nom']>;
  adresse: FormControl<ICentreSante['adresse']>;
  contact: FormControl<ICentreSante['contact']>;
  email: FormControl<ICentreSante['email']>;
  numeroMatriculation: FormControl<ICentreSante['numeroMatriculation']>;
};

export type CentreSanteFormGroup = FormGroup<CentreSanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CentreSanteFormService {
  createCentreSanteFormGroup(centreSante: CentreSanteFormGroupInput = { id: null }): CentreSanteFormGroup {
    const centreSanteRawValue = {
      ...this.getFormDefaults(),
      ...centreSante,
    };
    return new FormGroup<CentreSanteFormGroupContent>({
      id: new FormControl(
        { value: centreSanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(centreSanteRawValue.nom),
      adresse: new FormControl(centreSanteRawValue.adresse),
      contact: new FormControl(centreSanteRawValue.contact),
      email: new FormControl(centreSanteRawValue.email),
      numeroMatriculation: new FormControl(centreSanteRawValue.numeroMatriculation),
    });
  }

  getCentreSante(form: CentreSanteFormGroup): ICentreSante | NewCentreSante {
    return form.getRawValue() as ICentreSante | NewCentreSante;
  }

  resetForm(form: CentreSanteFormGroup, centreSante: CentreSanteFormGroupInput): void {
    const centreSanteRawValue = { ...this.getFormDefaults(), ...centreSante };
    form.reset(
      {
        ...centreSanteRawValue,
        id: { value: centreSanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CentreSanteFormDefaults {
    return {
      id: null,
    };
  }
}
