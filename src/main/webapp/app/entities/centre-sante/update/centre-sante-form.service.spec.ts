import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../centre-sante.test-samples';

import { CentreSanteFormService } from './centre-sante-form.service';

describe('CentreSante Form Service', () => {
  let service: CentreSanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreSanteFormService);
  });

  describe('Service methods', () => {
    describe('createCentreSanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCentreSanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            adresse: expect.any(Object),
            contact: expect.any(Object),
            email: expect.any(Object),
            numeroMatriculation: expect.any(Object),
          })
        );
      });

      it('passing ICentreSante should create a new form with FormGroup', () => {
        const formGroup = service.createCentreSanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            adresse: expect.any(Object),
            contact: expect.any(Object),
            email: expect.any(Object),
            numeroMatriculation: expect.any(Object),
          })
        );
      });
    });

    describe('getCentreSante', () => {
      it('should return NewCentreSante for default CentreSante initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCentreSanteFormGroup(sampleWithNewData);

        const centreSante = service.getCentreSante(formGroup) as any;

        expect(centreSante).toMatchObject(sampleWithNewData);
      });

      it('should return NewCentreSante for empty CentreSante initial value', () => {
        const formGroup = service.createCentreSanteFormGroup();

        const centreSante = service.getCentreSante(formGroup) as any;

        expect(centreSante).toMatchObject({});
      });

      it('should return ICentreSante', () => {
        const formGroup = service.createCentreSanteFormGroup(sampleWithRequiredData);

        const centreSante = service.getCentreSante(formGroup) as any;

        expect(centreSante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICentreSante should not enable id FormControl', () => {
        const formGroup = service.createCentreSanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCentreSante should disable id FormControl', () => {
        const formGroup = service.createCentreSanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
