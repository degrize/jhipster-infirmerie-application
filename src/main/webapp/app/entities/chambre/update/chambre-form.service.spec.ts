import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../chambre.test-samples';

import { ChambreFormService } from './chambre-form.service';

describe('Chambre Form Service', () => {
  let service: ChambreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChambreFormService);
  });

  describe('Service methods', () => {
    describe('createChambreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createChambreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroChambre: expect.any(Object),
            batiment: expect.any(Object),
          })
        );
      });

      it('passing IChambre should create a new form with FormGroup', () => {
        const formGroup = service.createChambreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numeroChambre: expect.any(Object),
            batiment: expect.any(Object),
          })
        );
      });
    });

    describe('getChambre', () => {
      it('should return NewChambre for default Chambre initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createChambreFormGroup(sampleWithNewData);

        const chambre = service.getChambre(formGroup) as any;

        expect(chambre).toMatchObject(sampleWithNewData);
      });

      it('should return NewChambre for empty Chambre initial value', () => {
        const formGroup = service.createChambreFormGroup();

        const chambre = service.getChambre(formGroup) as any;

        expect(chambre).toMatchObject({});
      });

      it('should return IChambre', () => {
        const formGroup = service.createChambreFormGroup(sampleWithRequiredData);

        const chambre = service.getChambre(formGroup) as any;

        expect(chambre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IChambre should not enable id FormControl', () => {
        const formGroup = service.createChambreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewChambre should disable id FormControl', () => {
        const formGroup = service.createChambreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
