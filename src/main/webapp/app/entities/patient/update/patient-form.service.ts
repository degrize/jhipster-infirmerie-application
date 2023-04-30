import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPatient, NewPatient } from '../patient.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPatient for edit and NewPatientFormGroupInput for create.
 */
type PatientFormGroupInput = IPatient | PartialWithRequiredKeyOf<NewPatient>;

type PatientFormDefaults = Pick<NewPatient, 'id'>;

type PatientFormGroupContent = {
  id: FormControl<IPatient['id'] | NewPatient['id']>;
  nom: FormControl<IPatient['nom']>;
  preNom: FormControl<IPatient['preNom']>;
  dateNaissance: FormControl<IPatient['dateNaissance']>;
  lieuNaissance: FormControl<IPatient['lieuNaissance']>;
  sexe: FormControl<IPatient['sexe']>;
  photo: FormControl<IPatient['photo']>;
  photoContentType: FormControl<IPatient['photoContentType']>;
  contact: FormControl<IPatient['contact']>;
  statut: FormControl<IPatient['statut']>;
  tabac: FormControl<IPatient['tabac']>;
  alcool: FormControl<IPatient['alcool']>;
  sport: FormControl<IPatient['sport']>;
  cigarette: FormControl<IPatient['cigarette']>;
  contactParent: FormControl<IPatient['contactParent']>;
};

export type PatientFormGroup = FormGroup<PatientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PatientFormService {
  createPatientFormGroup(patient: PatientFormGroupInput = { id: null }): PatientFormGroup {
    const patientRawValue = {
      ...this.getFormDefaults(),
      ...patient,
    };
    return new FormGroup<PatientFormGroupContent>({
      id: new FormControl(
        { value: patientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(patientRawValue.nom),
      preNom: new FormControl(patientRawValue.preNom),
      dateNaissance: new FormControl(patientRawValue.dateNaissance),
      lieuNaissance: new FormControl(patientRawValue.lieuNaissance),
      sexe: new FormControl(patientRawValue.sexe),
      photo: new FormControl(patientRawValue.photo),
      photoContentType: new FormControl(patientRawValue.photoContentType),
      contact: new FormControl(patientRawValue.contact),
      statut: new FormControl(patientRawValue.statut),
      tabac: new FormControl(patientRawValue.tabac),
      alcool: new FormControl(patientRawValue.alcool),
      sport: new FormControl(patientRawValue.sport),
      cigarette: new FormControl(patientRawValue.cigarette),
      contactParent: new FormControl(patientRawValue.contactParent),
    });
  }

  getPatient(form: PatientFormGroup): IPatient | NewPatient {
    return form.getRawValue() as IPatient | NewPatient;
  }

  resetForm(form: PatientFormGroup, patient: PatientFormGroupInput): void {
    const patientRawValue = { ...this.getFormDefaults(), ...patient };
    form.reset(
      {
        ...patientRawValue,
        id: { value: patientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PatientFormDefaults {
    return {
      id: null,
    };
  }
}
