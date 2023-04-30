import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../consultation.test-samples';

import { ConsultationFormService } from './consultation-form.service';

describe('Consultation Form Service', () => {
  let service: ConsultationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationFormService);
  });

  describe('Service methods', () => {
    describe('createConsultationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConsultationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateConsultation: expect.any(Object),
            motif: expect.any(Object),
            diagnostic: expect.any(Object),
            consultationObservation: expect.any(Object),
            constante: expect.any(Object),
            patient: expect.any(Object),
            agentSante: expect.any(Object),
            ordonnance: expect.any(Object),
            typeConsultation: expect.any(Object),
            pathologies: expect.any(Object),
          })
        );
      });

      it('passing IConsultation should create a new form with FormGroup', () => {
        const formGroup = service.createConsultationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateConsultation: expect.any(Object),
            motif: expect.any(Object),
            diagnostic: expect.any(Object),
            consultationObservation: expect.any(Object),
            constante: expect.any(Object),
            patient: expect.any(Object),
            agentSante: expect.any(Object),
            ordonnance: expect.any(Object),
            typeConsultation: expect.any(Object),
            pathologies: expect.any(Object),
          })
        );
      });
    });

    describe('getConsultation', () => {
      it('should return NewConsultation for default Consultation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConsultationFormGroup(sampleWithNewData);

        const consultation = service.getConsultation(formGroup) as any;

        expect(consultation).toMatchObject(sampleWithNewData);
      });

      it('should return NewConsultation for empty Consultation initial value', () => {
        const formGroup = service.createConsultationFormGroup();

        const consultation = service.getConsultation(formGroup) as any;

        expect(consultation).toMatchObject({});
      });

      it('should return IConsultation', () => {
        const formGroup = service.createConsultationFormGroup(sampleWithRequiredData);

        const consultation = service.getConsultation(formGroup) as any;

        expect(consultation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConsultation should not enable id FormControl', () => {
        const formGroup = service.createConsultationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConsultation should disable id FormControl', () => {
        const formGroup = service.createConsultationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
