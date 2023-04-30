import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pathologie.test-samples';

import { PathologieFormService } from './pathologie-form.service';

describe('Pathologie Form Service', () => {
  let service: PathologieFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathologieFormService);
  });

  describe('Service methods', () => {
    describe('createPathologieFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPathologieFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libellePathologie: expect.any(Object),
            typePathologie: expect.any(Object),
            consultations: expect.any(Object),
          })
        );
      });

      it('passing IPathologie should create a new form with FormGroup', () => {
        const formGroup = service.createPathologieFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            libellePathologie: expect.any(Object),
            typePathologie: expect.any(Object),
            consultations: expect.any(Object),
          })
        );
      });
    });

    describe('getPathologie', () => {
      it('should return NewPathologie for default Pathologie initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPathologieFormGroup(sampleWithNewData);

        const pathologie = service.getPathologie(formGroup) as any;

        expect(pathologie).toMatchObject(sampleWithNewData);
      });

      it('should return NewPathologie for empty Pathologie initial value', () => {
        const formGroup = service.createPathologieFormGroup();

        const pathologie = service.getPathologie(formGroup) as any;

        expect(pathologie).toMatchObject({});
      });

      it('should return IPathologie', () => {
        const formGroup = service.createPathologieFormGroup(sampleWithRequiredData);

        const pathologie = service.getPathologie(formGroup) as any;

        expect(pathologie).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPathologie should not enable id FormControl', () => {
        const formGroup = service.createPathologieFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPathologie should disable id FormControl', () => {
        const formGroup = service.createPathologieFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
