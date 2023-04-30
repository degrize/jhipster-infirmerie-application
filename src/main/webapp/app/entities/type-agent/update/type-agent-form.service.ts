import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITypeAgent, NewTypeAgent } from '../type-agent.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITypeAgent for edit and NewTypeAgentFormGroupInput for create.
 */
type TypeAgentFormGroupInput = ITypeAgent | PartialWithRequiredKeyOf<NewTypeAgent>;

type TypeAgentFormDefaults = Pick<NewTypeAgent, 'id'>;

type TypeAgentFormGroupContent = {
  id: FormControl<ITypeAgent['id'] | NewTypeAgent['id']>;
  typeAgent: FormControl<ITypeAgent['typeAgent']>;
  agentSante: FormControl<ITypeAgent['agentSante']>;
};

export type TypeAgentFormGroup = FormGroup<TypeAgentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeAgentFormService {
  createTypeAgentFormGroup(typeAgent: TypeAgentFormGroupInput = { id: null }): TypeAgentFormGroup {
    const typeAgentRawValue = {
      ...this.getFormDefaults(),
      ...typeAgent,
    };
    return new FormGroup<TypeAgentFormGroupContent>({
      id: new FormControl(
        { value: typeAgentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      typeAgent: new FormControl(typeAgentRawValue.typeAgent),
      agentSante: new FormControl(typeAgentRawValue.agentSante),
    });
  }

  getTypeAgent(form: TypeAgentFormGroup): ITypeAgent | NewTypeAgent {
    return form.getRawValue() as ITypeAgent | NewTypeAgent;
  }

  resetForm(form: TypeAgentFormGroup, typeAgent: TypeAgentFormGroupInput): void {
    const typeAgentRawValue = { ...this.getFormDefaults(), ...typeAgent };
    form.reset(
      {
        ...typeAgentRawValue,
        id: { value: typeAgentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TypeAgentFormDefaults {
    return {
      id: null,
    };
  }
}
