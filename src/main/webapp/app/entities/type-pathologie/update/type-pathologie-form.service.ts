import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITypePathologie, NewTypePathologie } from '../type-pathologie.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypePathologie for edit and NewTypePathologieFormGroupInput for create.
 */
type TypePathologieFormGroupInput = ITypePathologie | PartialWithRequiredKeyOf<NewTypePathologie>;

type TypePathologieFormDefaults = Pick<NewTypePathologie, 'id'>;

type TypePathologieFormGroupContent = {
  id: FormControl<ITypePathologie['id'] | NewTypePathologie['id']>;
  typePathologie: FormControl<ITypePathologie['typePathologie']>;
};

export type TypePathologieFormGroup = FormGroup<TypePathologieFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypePathologieFormService {
  createTypePathologieFormGroup(typePathologie: TypePathologieFormGroupInput = { id: null }): TypePathologieFormGroup {
    const typePathologieRawValue = {
      ...this.getFormDefaults(),
      ...typePathologie,
    };
    return new FormGroup<TypePathologieFormGroupContent>({
      id: new FormControl(
        { value: typePathologieRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      typePathologie: new FormControl(typePathologieRawValue.typePathologie),
    });
  }

  getTypePathologie(form: TypePathologieFormGroup): ITypePathologie | NewTypePathologie {
    return form.getRawValue() as ITypePathologie | NewTypePathologie;
  }

  resetForm(form: TypePathologieFormGroup, typePathologie: TypePathologieFormGroupInput): void {
    const typePathologieRawValue = { ...this.getFormDefaults(), ...typePathologie };
    form.reset(
      {
        ...typePathologieRawValue,
        id: { value: typePathologieRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TypePathologieFormDefaults {
    return {
      id: null,
    };
  }
}
