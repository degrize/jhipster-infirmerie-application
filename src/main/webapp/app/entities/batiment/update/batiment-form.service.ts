import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBatiment, NewBatiment } from '../batiment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBatiment for edit and NewBatimentFormGroupInput for create.
 */
type BatimentFormGroupInput = IBatiment | PartialWithRequiredKeyOf<NewBatiment>;

type BatimentFormDefaults = Pick<NewBatiment, 'id'>;

type BatimentFormGroupContent = {
  id: FormControl<IBatiment['id'] | NewBatiment['id']>;
  nom: FormControl<IBatiment['nom']>;
  site: FormControl<IBatiment['site']>;
};

export type BatimentFormGroup = FormGroup<BatimentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BatimentFormService {
  createBatimentFormGroup(batiment: BatimentFormGroupInput = { id: null }): BatimentFormGroup {
    const batimentRawValue = {
      ...this.getFormDefaults(),
      ...batiment,
    };
    return new FormGroup<BatimentFormGroupContent>({
      id: new FormControl(
        { value: batimentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(batimentRawValue.nom),
      site: new FormControl(batimentRawValue.site),
    });
  }

  getBatiment(form: BatimentFormGroup): IBatiment | NewBatiment {
    return form.getRawValue() as IBatiment | NewBatiment;
  }

  resetForm(form: BatimentFormGroup, batiment: BatimentFormGroupInput): void {
    const batimentRawValue = { ...this.getFormDefaults(), ...batiment };
    form.reset(
      {
        ...batimentRawValue,
        id: { value: batimentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BatimentFormDefaults {
    return {
      id: null,
    };
  }
}
