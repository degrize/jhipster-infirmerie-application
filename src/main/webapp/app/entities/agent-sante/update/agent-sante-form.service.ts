import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAgentSante, NewAgentSante } from '../agent-sante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgentSante for edit and NewAgentSanteFormGroupInput for create.
 */
type AgentSanteFormGroupInput = IAgentSante | PartialWithRequiredKeyOf<NewAgentSante>;

type AgentSanteFormDefaults = Pick<NewAgentSante, 'id' | 'specialites'>;

type AgentSanteFormGroupContent = {
  id: FormControl<IAgentSante['id'] | NewAgentSante['id']>;
  nom: FormControl<IAgentSante['nom']>;
  prenom: FormControl<IAgentSante['prenom']>;
  contact: FormControl<IAgentSante['contact']>;
  adresse: FormControl<IAgentSante['adresse']>;
  login: FormControl<IAgentSante['login']>;
  motDePasse: FormControl<IAgentSante['motDePasse']>;
  specialites: FormControl<IAgentSante['specialites']>;
};

export type AgentSanteFormGroup = FormGroup<AgentSanteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgentSanteFormService {
  createAgentSanteFormGroup(agentSante: AgentSanteFormGroupInput = { id: null }): AgentSanteFormGroup {
    const agentSanteRawValue = {
      ...this.getFormDefaults(),
      ...agentSante,
    };
    return new FormGroup<AgentSanteFormGroupContent>({
      id: new FormControl(
        { value: agentSanteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(agentSanteRawValue.nom),
      prenom: new FormControl(agentSanteRawValue.prenom),
      contact: new FormControl(agentSanteRawValue.contact),
      adresse: new FormControl(agentSanteRawValue.adresse),
      login: new FormControl(agentSanteRawValue.login),
      motDePasse: new FormControl(agentSanteRawValue.motDePasse),
      specialites: new FormControl(agentSanteRawValue.specialites ?? []),
    });
  }

  getAgentSante(form: AgentSanteFormGroup): IAgentSante | NewAgentSante {
    return form.getRawValue() as IAgentSante | NewAgentSante;
  }

  resetForm(form: AgentSanteFormGroup, agentSante: AgentSanteFormGroupInput): void {
    const agentSanteRawValue = { ...this.getFormDefaults(), ...agentSante };
    form.reset(
      {
        ...agentSanteRawValue,
        id: { value: agentSanteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AgentSanteFormDefaults {
    return {
      id: null,
      specialites: [],
    };
  }
}
