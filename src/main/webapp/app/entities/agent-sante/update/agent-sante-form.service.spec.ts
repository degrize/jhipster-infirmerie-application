import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../agent-sante.test-samples';

import { AgentSanteFormService } from './agent-sante-form.service';

describe('AgentSante Form Service', () => {
  let service: AgentSanteFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentSanteFormService);
  });

  describe('Service methods', () => {
    describe('createAgentSanteFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAgentSanteFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            contact: expect.any(Object),
            adresse: expect.any(Object),
            login: expect.any(Object),
            motDePasse: expect.any(Object),
            specialites: expect.any(Object),
          })
        );
      });

      it('passing IAgentSante should create a new form with FormGroup', () => {
        const formGroup = service.createAgentSanteFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            prenom: expect.any(Object),
            contact: expect.any(Object),
            adresse: expect.any(Object),
            login: expect.any(Object),
            motDePasse: expect.any(Object),
            specialites: expect.any(Object),
          })
        );
      });
    });

    describe('getAgentSante', () => {
      it('should return NewAgentSante for default AgentSante initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAgentSanteFormGroup(sampleWithNewData);

        const agentSante = service.getAgentSante(formGroup) as any;

        expect(agentSante).toMatchObject(sampleWithNewData);
      });

      it('should return NewAgentSante for empty AgentSante initial value', () => {
        const formGroup = service.createAgentSanteFormGroup();

        const agentSante = service.getAgentSante(formGroup) as any;

        expect(agentSante).toMatchObject({});
      });

      it('should return IAgentSante', () => {
        const formGroup = service.createAgentSanteFormGroup(sampleWithRequiredData);

        const agentSante = service.getAgentSante(formGroup) as any;

        expect(agentSante).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAgentSante should not enable id FormControl', () => {
        const formGroup = service.createAgentSanteFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAgentSante should disable id FormControl', () => {
        const formGroup = service.createAgentSanteFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
