import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPathologie, NewPathologie } from '../pathologie.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPathologie for edit and NewPathologieFormGroupInput for create.
 */
type PathologieFormGroupInput = IPathologie | PartialWithRequiredKeyOf<NewPathologie>;

type PathologieFormDefaults = Pick<NewPathologie, 'id' | 'consultations'>;

type PathologieFormGroupContent = {
  id: FormControl<IPathologie['id'] | NewPathologie['id']>;
  libellePathologie: FormControl<IPathologie['libellePathologie']>;
  typePathologie: FormControl<IPathologie['typePathologie']>;
  consultations: FormControl<IPathologie['consultations']>;
};

export type PathologieFormGroup = FormGroup<PathologieFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PathologieFormService {
  createPathologieFormGroup(pathologie: PathologieFormGroupInput = { id: null }): PathologieFormGroup {
    const pathologieRawValue = {
      ...this.getFormDefaults(),
      ...pathologie,
    };
    return new FormGroup<PathologieFormGroupContent>({
      id: new FormControl(
        { value: pathologieRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      libellePathologie: new FormControl(pathologieRawValue.libellePathologie),
      typePathologie: new FormControl(pathologieRawValue.typePathologie),
      consultations: new FormControl(pathologieRawValue.consultations ?? []),
    });
  }

  getPathologie(form: PathologieFormGroup): IPathologie | NewPathologie {
    return form.getRawValue() as IPathologie | NewPathologie;
  }

  resetForm(form: PathologieFormGroup, pathologie: PathologieFormGroupInput): void {
    const pathologieRawValue = { ...this.getFormDefaults(), ...pathologie };
    form.reset(
      {
        ...pathologieRawValue,
        id: { value: pathologieRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PathologieFormDefaults {
    return {
      id: null,
      consultations: [],
    };
  }
}
