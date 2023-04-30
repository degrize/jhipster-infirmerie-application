import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConsultation, NewConsultation } from '../consultation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConsultation for edit and NewConsultationFormGroupInput for create.
 */
type ConsultationFormGroupInput = IConsultation | PartialWithRequiredKeyOf<NewConsultation>;

type ConsultationFormDefaults = Pick<NewConsultation, 'id' | 'pathologies'>;

type ConsultationFormGroupContent = {
  id: FormControl<IConsultation['id'] | NewConsultation['id']>;
  dateConsultation: FormControl<IConsultation['dateConsultation']>;
  motif: FormControl<IConsultation['motif']>;
  diagnostic: FormControl<IConsultation['diagnostic']>;
  consultationObservation: FormControl<IConsultation['consultationObservation']>;
  constante: FormControl<IConsultation['constante']>;
  patient: FormControl<IConsultation['patient']>;
  agentSante: FormControl<IConsultation['agentSante']>;
  ordonnance: FormControl<IConsultation['ordonnance']>;
  typeConsultation: FormControl<IConsultation['typeConsultation']>;
  pathologies: FormControl<IConsultation['pathologies']>;
};

export type ConsultationFormGroup = FormGroup<ConsultationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConsultationFormService {
  createConsultationFormGroup(consultation: ConsultationFormGroupInput = { id: null }): ConsultationFormGroup {
    const consultationRawValue = {
      ...this.getFormDefaults(),
      ...consultation,
    };
    return new FormGroup<ConsultationFormGroupContent>({
      id: new FormControl(
        { value: consultationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dateConsultation: new FormControl(consultationRawValue.dateConsultation),
      motif: new FormControl(consultationRawValue.motif),
      diagnostic: new FormControl(consultationRawValue.diagnostic),
      consultationObservation: new FormControl(consultationRawValue.consultationObservation),
      constante: new FormControl(consultationRawValue.constante),
      patient: new FormControl(consultationRawValue.patient),
      agentSante: new FormControl(consultationRawValue.agentSante),
      ordonnance: new FormControl(consultationRawValue.ordonnance),
      typeConsultation: new FormControl(consultationRawValue.typeConsultation),
      pathologies: new FormControl(consultationRawValue.pathologies ?? []),
    });
  }

  getConsultation(form: ConsultationFormGroup): IConsultation | NewConsultation {
    return form.getRawValue() as IConsultation | NewConsultation;
  }

  resetForm(form: ConsultationFormGroup, consultation: ConsultationFormGroupInput): void {
    const consultationRawValue = { ...this.getFormDefaults(), ...consultation };
    form.reset(
      {
        ...consultationRawValue,
        id: { value: consultationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConsultationFormDefaults {
    return {
      id: null,
      pathologies: [],
    };
  }
}
