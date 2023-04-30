import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type-consultation.test-samples';

import { TypeConsultationFormService } from './type-consultation-form.service';

describe('TypeConsultation Form Service', () => {
  let service: TypeConsultationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeConsultationFormService);
  });

  describe('Service methods', () => {
    describe('createTypeConsultationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeConsultationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelleTypeConsultation: expect.any(Object),
          })
        );
      });

      it('passing ITypeConsultation should create a new form with FormGroup', () => {
        const formGroup = service.createTypeConsultationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libelleTypeConsultation: expect.any(Object),
          })
        );
      });
    });

    describe('getTypeConsultation', () => {
      it('should return NewTypeConsultation for default TypeConsultation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTypeConsultationFormGroup(sampleWithNewData);

        const typeConsultation = service.getTypeConsultation(formGroup) as any;

        expect(typeConsultation).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypeConsultation for empty TypeConsultation initial value', () => {
        const formGroup = service.createTypeConsultationFormGroup();

        const typeConsultation = service.getTypeConsultation(formGroup) as any;

        expect(typeConsultation).toMatchObject({});
      });

      it('should return ITypeConsultation', () => {
        const formGroup = service.createTypeConsultationFormGroup(sampleWithRequiredData);

        const typeConsultation = service.getTypeConsultation(formGroup) as any;

        expect(typeConsultation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypeConsultation should not enable id FormControl', () => {
        const formGroup = service.createTypeConsultationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypeConsultation should disable id FormControl', () => {
        const formGroup = service.createTypeConsultationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
