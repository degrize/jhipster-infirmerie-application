import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../constante.test-samples';

import { ConstanteFormService } from './constante-form.service';

describe('Constante Form Service', () => {
  let service: ConstanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstanteFormService);
  });

  describe('Service methods', () => {
    describe('createConstanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConstanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            masse: expect.any(Object),
            temperature: expect.any(Object),
            taille: expect.any(Object),
            pouls: expect.any(Object),
          })
        );
      });

      it('passing IConstante should create a new form with FormGroup', () => {
        const formGroup = service.createConstanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            masse: expect.any(Object),
            temperature: expect.any(Object),
            taille: expect.any(Object),
            pouls: expect.any(Object),
          })
        );
      });
    });

    describe('getConstante', () => {
      it('should return NewConstante for default Constante initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConstanteFormGroup(sampleWithNewData);

        const constante = service.getConstante(formGroup) as any;

        expect(constante).toMatchObject(sampleWithNewData);
      });

      it('should return NewConstante for empty Constante initial value', () => {
        const formGroup = service.createConstanteFormGroup();

        const constante = service.getConstante(formGroup) as any;

        expect(constante).toMatchObject({});
      });

      it('should return IConstante', () => {
        const formGroup = service.createConstanteFormGroup(sampleWithRequiredData);

        const constante = service.getConstante(formGroup) as any;

        expect(constante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConstante should not enable id FormControl', () => {
        const formGroup = service.createConstanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConstante should disable id FormControl', () => {
        const formGroup = service.createConstanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
