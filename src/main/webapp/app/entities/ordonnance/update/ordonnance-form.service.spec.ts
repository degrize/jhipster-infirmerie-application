import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../ordonnance.test-samples';

import { OrdonnanceFormService } from './ordonnance-form.service';

describe('Ordonnance Form Service', () => {
  let service: OrdonnanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdonnanceFormService);
  });

  describe('Service methods', () => {
    describe('createOrdonnanceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrdonnanceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ordonnanceDescription: expect.any(Object),
          })
        );
      });

      it('passing IOrdonnance should create a new form with FormGroup', () => {
        const formGroup = service.createOrdonnanceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            ordonnanceDescription: expect.any(Object),
          })
        );
      });
    });

    describe('getOrdonnance', () => {
      it('should return NewOrdonnance for default Ordonnance initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOrdonnanceFormGroup(sampleWithNewData);

        const ordonnance = service.getOrdonnance(formGroup) as any;

        expect(ordonnance).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrdonnance for empty Ordonnance initial value', () => {
        const formGroup = service.createOrdonnanceFormGroup();

        const ordonnance = service.getOrdonnance(formGroup) as any;

        expect(ordonnance).toMatchObject({});
      });

      it('should return IOrdonnance', () => {
        const formGroup = service.createOrdonnanceFormGroup(sampleWithRequiredData);

        const ordonnance = service.getOrdonnance(formGroup) as any;

        expect(ordonnance).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrdonnance should not enable id FormControl', () => {
        const formGroup = service.createOrdonnanceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrdonnance should disable id FormControl', () => {
        const formGroup = service.createOrdonnanceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
