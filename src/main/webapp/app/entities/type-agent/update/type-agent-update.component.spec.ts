import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeAgentFormService } from './type-agent-form.service';
import { TypeAgentService } from '../service/type-agent.service';
import { ITypeAgent } from '../type-agent.model';
import { IAgentSante } from 'app/entities/agent-sante/agent-sante.model';
import { AgentSanteService } from 'app/entities/agent-sante/service/agent-sante.service';

import { TypeAgentUpdateComponent } from './type-agent-update.component';

describe('TypeAgent Management Update Component', () => {
  let comp: TypeAgentUpdateComponent;
  let fixture: ComponentFixture<TypeAgentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeAgentFormService: TypeAgentFormService;
  let typeAgentService: TypeAgentService;
  let agentSanteService: AgentSanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeAgentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TypeAgentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeAgentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeAgentFormService = TestBed.inject(TypeAgentFormService);
    typeAgentService = TestBed.inject(TypeAgentService);
    agentSanteService = TestBed.inject(AgentSanteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AgentSante query and add missing value', () => {
      const typeAgent: ITypeAgent = { id: 456 };
      const agentSante: IAgentSante = { id: 70146 };
      typeAgent.agentSante = agentSante;

      const agentSanteCollection: IAgentSante[] = [{ id: 56909 }];
      jest.spyOn(agentSanteService, 'query').mockReturnValue(of(new HttpResponse({ body: agentSanteCollection })));
      const additionalAgentSantes = [agentSante];
      const expectedCollection: IAgentSante[] = [...additionalAgentSantes, ...agentSanteCollection];
      jest.spyOn(agentSanteService, 'addAgentSanteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ typeAgent });
      comp.ngOnInit();

      expect(agentSanteService.query).toHaveBeenCalled();
      expect(agentSanteService.addAgentSanteToCollectionIfMissing).toHaveBeenCalledWith(
        agentSanteCollection,
        ...additionalAgentSantes.map(expect.objectContaining)
      );
      expect(comp.agentSantesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const typeAgent: ITypeAgent = { id: 456 };
      const agentSante: IAgentSante = { id: 3542 };
      typeAgent.agentSante = agentSante;

      activatedRoute.data = of({ typeAgent });
      comp.ngOnInit();

      expect(comp.agentSantesSharedCollection).toContain(agentSante);
      expect(comp.typeAgent).toEqual(typeAgent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeAgent>>();
      const typeAgent = { id: 123 };
      jest.spyOn(typeAgentFormService, 'getTypeAgent').mockReturnValue(typeAgent);
      jest.spyOn(typeAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeAgent }));
      saveSubject.complete();

      // THEN
      expect(typeAgentFormService.getTypeAgent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeAgentService.update).toHaveBeenCalledWith(expect.objectContaining(typeAgent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeAgent>>();
      const typeAgent = { id: 123 };
      jest.spyOn(typeAgentFormService, 'getTypeAgent').mockReturnValue({ id: null });
      jest.spyOn(typeAgentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeAgent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeAgent }));
      saveSubject.complete();

      // THEN
      expect(typeAgentFormService.getTypeAgent).toHaveBeenCalled();
      expect(typeAgentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITypeAgent>>();
      const typeAgent = { id: 123 };
      jest.spyOn(typeAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeAgentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAgentSante', () => {
      it('Should forward to agentSanteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(agentSanteService, 'compareAgentSante');
        comp.compareAgentSante(entity, entity2);
        expect(agentSanteService.compareAgentSante).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
