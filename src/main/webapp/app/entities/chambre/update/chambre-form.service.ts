import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChambre, NewChambre } from '../chambre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChambre for edit and NewChambreFormGroupInput for create.
 */
type ChambreFormGroupInput = IChambre | PartialWithRequiredKeyOf<NewChambre>;

type ChambreFormDefaults = Pick<NewChambre, 'id'>;

type ChambreFormGroupContent = {
  id: FormControl<IChambre['id'] | NewChambre['id']>;
  numeroChambre: FormControl<IChambre['numeroChambre']>;
  batiment: FormControl<IChambre['batiment']>;
};

export type ChambreFormGroup = FormGroup<ChambreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChambreFormService {
  createChambreFormGroup(chambre: ChambreFormGroupInput = { id: null }): ChambreFormGroup {
    const chambreRawValue = {
      ...this.getFormDefaults(),
      ...chambre,
    };
    return new FormGroup<ChambreFormGroupContent>({
      id: new FormControl(
        { value: chambreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      numeroChambre: new FormControl(chambreRawValue.numeroChambre),
      batiment: new FormControl(chambreRawValue.batiment),
    });
  }

  getChambre(form: ChambreFormGroup): IChambre | NewChambre {
    return form.getRawValue() as IChambre | NewChambre;
  }

  resetForm(form: ChambreFormGroup, chambre: ChambreFormGroupInput): void {
    const chambreRawValue = { ...this.getFormDefaults(), ...chambre };
    form.reset(
      {
        ...chambreRawValue,
        id: { value: chambreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChambreFormDefaults {
    return {
      id: null,
    };
  }
}
