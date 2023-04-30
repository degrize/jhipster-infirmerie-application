import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../type-agent.test-samples';

import { TypeAgentFormService } from './type-agent-form.service';

describe('TypeAgent Form Service', () => {
  let service: TypeAgentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeAgentFormService);
  });

  describe('Service methods', () => {
    describe('createTypeAgentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTypeAgentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeAgent: expect.any(Object),
            agentSante: expect.any(Object),
          })
        );
      });

      it('passing ITypeAgent should create a new form with FormGroup', () => {
        const formGroup = service.createTypeAgentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            typeAgent: expect.any(Object),
            agentSante: expect.any(Object),
          })
        );
      });
    });

    describe('getTypeAgent', () => {
      it('should return NewTypeAgent for default TypeAgent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTypeAgentFormGroup(sampleWithNewData);

        const typeAgent = service.getTypeAgent(formGroup) as any;

        expect(typeAgent).toMatchObject(sampleWithNewData);
      });

      it('should return NewTypeAgent for empty TypeAgent initial value', () => {
        const formGroup = service.createTypeAgentFormGroup();

        const typeAgent = service.getTypeAgent(formGroup) as any;

        expect(typeAgent).toMatchObject({});
      });

      it('should return ITypeAgent', () => {
        const formGroup = service.createTypeAgentFormGroup(sampleWithRequiredData);

        const typeAgent = service.getTypeAgent(formGroup) as any;

        expect(typeAgent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITypeAgent should not enable id FormControl', () => {
        const formGroup = service.createTypeAgentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTypeAgent should disable id FormControl', () => {
        const formGroup = service.createTypeAgentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
