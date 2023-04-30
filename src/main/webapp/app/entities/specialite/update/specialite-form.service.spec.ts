import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../specialite.test-samples';

import { SpecialiteFormService } from './specialite-form.service';

describe('Specialite Form Service', () => {
  let service: SpecialiteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialiteFormService);
  });

  describe('Service methods', () => {
    describe('createSpecialiteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpecialiteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            specialite: expect.any(Object),
            agentSantes: expect.any(Object),
          })
        );
      });

      it('passing ISpecialite should create a new form with FormGroup', () => {
        const formGroup = service.createSpecialiteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            specialite: expect.any(Object),
            agentSantes: expect.any(Object),
          })
        );
      });
    });

    describe('getSpecialite', () => {
      it('should return NewSpecialite for default Specialite initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSpecialiteFormGroup(sampleWithNewData);

        const specialite = service.getSpecialite(formGroup) as any;

        expect(specialite).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpecialite for empty Specialite initial value', () => {
        const formGroup = service.createSpecialiteFormGroup();

        const specialite = service.getSpecialite(formGroup) as any;

        expect(specialite).toMatchObject({});
      });

      it('should return ISpecialite', () => {
        const formGroup = service.createSpecialiteFormGroup(sampleWithRequiredData);

        const specialite = service.getSpecialite(formGroup) as any;

        expect(specialite).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpecialite should not enable id FormControl', () => {
        const formGroup = service.createSpecialiteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpecialite should disable id FormControl', () => {
        const formGroup = service.createSpecialiteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
