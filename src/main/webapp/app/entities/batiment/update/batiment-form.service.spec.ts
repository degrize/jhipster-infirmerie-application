import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../batiment.test-samples';

import { BatimentFormService } from './batiment-form.service';

describe('Batiment Form Service', () => {
  let service: BatimentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatimentFormService);
  });

  describe('Service methods', () => {
    describe('createBatimentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBatimentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            site: expect.any(Object),
          })
        );
      });

      it('passing IBatiment should create a new form with FormGroup', () => {
        const formGroup = service.createBatimentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            site: expect.any(Object),
          })
        );
      });
    });

    describe('getBatiment', () => {
      it('should return NewBatiment for default Batiment initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBatimentFormGroup(sampleWithNewData);

        const batiment = service.getBatiment(formGroup) as any;

        expect(batiment).toMatchObject(sampleWithNewData);
      });

      it('should return NewBatiment for empty Batiment initial value', () => {
        const formGroup = service.createBatimentFormGroup();

        const batiment = service.getBatiment(formGroup) as any;

        expect(batiment).toMatchObject({});
      });

      it('should return IBatiment', () => {
        const formGroup = service.createBatimentFormGroup(sampleWithRequiredData);

        const batiment = service.getBatiment(formGroup) as any;

        expect(batiment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBatiment should not enable id FormControl', () => {
        const formGroup = service.createBatimentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBatiment should disable id FormControl', () => {
        const formGroup = service.createBatimentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
