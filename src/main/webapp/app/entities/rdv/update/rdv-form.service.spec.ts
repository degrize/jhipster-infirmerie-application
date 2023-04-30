import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../rdv.test-samples';

import { RdvFormService } from './rdv-form.service';

describe('Rdv Form Service', () => {
  let service: RdvFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RdvFormService);
  });

  describe('Service methods', () => {
    describe('createRdvFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRdvFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateRdv: expect.any(Object),
            motif: expect.any(Object),
            consultation: expect.any(Object),
          })
        );
      });

      it('passing IRdv should create a new form with FormGroup', () => {
        const formGroup = service.createRdvFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dateRdv: expect.any(Object),
            motif: expect.any(Object),
            consultation: expect.any(Object),
          })
        );
      });
    });

    describe('getRdv', () => {
      it('should return NewRdv for default Rdv initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRdvFormGroup(sampleWithNewData);

        const rdv = service.getRdv(formGroup) as any;

        expect(rdv).toMatchObject(sampleWithNewData);
      });

      it('should return NewRdv for empty Rdv initial value', () => {
        const formGroup = service.createRdvFormGroup();

        const rdv = service.getRdv(formGroup) as any;

        expect(rdv).toMatchObject({});
      });

      it('should return IRdv', () => {
        const formGroup = service.createRdvFormGroup(sampleWithRequiredData);

        const rdv = service.getRdv(formGroup) as any;

        expect(rdv).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRdv should not enable id FormControl', () => {
        const formGroup = service.createRdvFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRdv should disable id FormControl', () => {
        const formGroup = service.createRdvFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
