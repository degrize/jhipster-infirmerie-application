import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mise-en-observation.test-samples';

import { MiseEnObservationFormService } from './mise-en-observation-form.service';

describe('MiseEnObservation Form Service', () => {
  let service: MiseEnObservationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiseEnObservationFormService);
  });

  describe('Service methods', () => {
    describe('createMiseEnObservationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMiseEnObservationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            description: expect.any(Object),
            miseEnObservation: expect.any(Object),
          })
        );
      });

      it('passing IMiseEnObservation should create a new form with FormGroup', () => {
        const formGroup = service.createMiseEnObservationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            description: expect.any(Object),
            miseEnObservation: expect.any(Object),
          })
        );
      });
    });

    describe('getMiseEnObservation', () => {
      it('should return NewMiseEnObservation for default MiseEnObservation initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMiseEnObservationFormGroup(sampleWithNewData);

        const miseEnObservation = service.getMiseEnObservation(formGroup) as any;

        expect(miseEnObservation).toMatchObject(sampleWithNewData);
      });

      it('should return NewMiseEnObservation for empty MiseEnObservation initial value', () => {
        const formGroup = service.createMiseEnObservationFormGroup();

        const miseEnObservation = service.getMiseEnObservation(formGroup) as any;

        expect(miseEnObservation).toMatchObject({});
      });

      it('should return IMiseEnObservation', () => {
        const formGroup = service.createMiseEnObservationFormGroup(sampleWithRequiredData);

        const miseEnObservation = service.getMiseEnObservation(formGroup) as any;

        expect(miseEnObservation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMiseEnObservation should not enable id FormControl', () => {
        const formGroup = service.createMiseEnObservationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMiseEnObservation should disable id FormControl', () => {
        const formGroup = service.createMiseEnObservationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
