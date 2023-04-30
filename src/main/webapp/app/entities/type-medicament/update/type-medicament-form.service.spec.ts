import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type-medicament.test-samples';

import { TypeMedicamentFormService } from './type-medicament-form.service';

describe('TypeMedicament Form Service', () => {
  let service: TypeMedicamentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeMedicamentFormService);
  });

  describe('Service methods', () => {
    describe('createTypeMedicamentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeMedicamentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeMedicament: expect.any(Object),
          })
        );
      });

      it('passing ITypeMedicament should create a new form with FormGroup', () => {
        const formGroup = service.createTypeMedicamentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeMedicament: expect.any(Object),
          })
        );
      });
    });

    describe('getTypeMedicament', () => {
      it('should return NewTypeMedicament for default TypeMedicament initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTypeMedicamentFormGroup(sampleWithNewData);

        const typeMedicament = service.getTypeMedicament(formGroup) as any;

        expect(typeMedicament).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypeMedicament for empty TypeMedicament initial value', () => {
        const formGroup = service.createTypeMedicamentFormGroup();

        const typeMedicament = service.getTypeMedicament(formGroup) as any;

        expect(typeMedicament).toMatchObject({});
      });

      it('should return ITypeMedicament', () => {
        const formGroup = service.createTypeMedicamentFormGroup(sampleWithRequiredData);

        const typeMedicament = service.getTypeMedicament(formGroup) as any;

        expect(typeMedicament).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypeMedicament should not enable id FormControl', () => {
        const formGroup = service.createTypeMedicamentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypeMedicament should disable id FormControl', () => {
        const formGroup = service.createTypeMedicamentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
