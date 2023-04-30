import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../antecedent.test-samples';

import { AntecedentFormService } from './antecedent-form.service';

describe('Antecedent Form Service', () => {
  let service: AntecedentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntecedentFormService);
  });

  describe('Service methods', () => {
    describe('createAntecedentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAntecedentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libAntecedent: expect.any(Object),
            patient: expect.any(Object),
          })
        );
      });

      it('passing IAntecedent should create a new form with FormGroup', () => {
        const formGroup = service.createAntecedentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libAntecedent: expect.any(Object),
            patient: expect.any(Object),
          })
        );
      });
    });

    describe('getAntecedent', () => {
      it('should return NewAntecedent for default Antecedent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAntecedentFormGroup(sampleWithNewData);

        const antecedent = service.getAntecedent(formGroup) as any;

        expect(antecedent).toMatchObject(sampleWithNewData);
      });

      it('should return NewAntecedent for empty Antecedent initial value', () => {
        const formGroup = service.createAntecedentFormGroup();

        const antecedent = service.getAntecedent(formGroup) as any;

        expect(antecedent).toMatchObject({});
      });

      it('should return IAntecedent', () => {
        const formGroup = service.createAntecedentFormGroup(sampleWithRequiredData);

        const antecedent = service.getAntecedent(formGroup) as any;

        expect(antecedent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAntecedent should not enable id FormControl', () => {
        const formGroup = service.createAntecedentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAntecedent should disable id FormControl', () => {
        const formGroup = service.createAntecedentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
