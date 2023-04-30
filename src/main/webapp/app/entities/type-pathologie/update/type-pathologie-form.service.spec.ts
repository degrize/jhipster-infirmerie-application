import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type-pathologie.test-samples';

import { TypePathologieFormService } from './type-pathologie-form.service';

describe('TypePathologie Form Service', () => {
  let service: TypePathologieFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePathologieFormService);
  });

  describe('Service methods', () => {
    describe('createTypePathologieFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypePathologieFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typePathologie: expect.any(Object),
          })
        );
      });

      it('passing ITypePathologie should create a new form with FormGroup', () => {
        const formGroup = service.createTypePathologieFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typePathologie: expect.any(Object),
          })
        );
      });
    });

    describe('getTypePathologie', () => {
      it('should return NewTypePathologie for default TypePathologie initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTypePathologieFormGroup(sampleWithNewData);

        const typePathologie = service.getTypePathologie(formGroup) as any;

        expect(typePathologie).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypePathologie for empty TypePathologie initial value', () => {
        const formGroup = service.createTypePathologieFormGroup();

        const typePathologie = service.getTypePathologie(formGroup) as any;

        expect(typePathologie).toMatchObject({});
      });

      it('should return ITypePathologie', () => {
        const formGroup = service.createTypePathologieFormGroup(sampleWithRequiredData);

        const typePathologie = service.getTypePathologie(formGroup) as any;

        expect(typePathologie).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypePathologie should not enable id FormControl', () => {
        const formGroup = service.createTypePathologieFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypePathologie should disable id FormControl', () => {
        const formGroup = service.createTypePathologieFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
