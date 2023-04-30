import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AgentSanteFormService } from './agent-sante-form.service';
import { AgentSanteService } from '../service/agent-sante.service';
import { IAgentSante } from '../agent-sante.model';
import { ISpecialite } from 'app/entities/specialite/specialite.model';
import { SpecialiteService } from 'app/entities/specialite/service/specialite.service';

import { AgentSanteUpdateComponent } from './agent-sante-update.component';

describe('AgentSante Management Update Component', () => {
  let comp: AgentSanteUpdateComponent;
  let fixture: ComponentFixture<AgentSanteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agentSanteFormService: AgentSanteFormService;
  let agentSanteService: AgentSanteService;
  let specialiteService: SpecialiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AgentSanteUpdateComponent],
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
      .overrideTemplate(AgentSanteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentSanteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agentSanteFormService = TestBed.inject(AgentSanteFormService);
    agentSanteService = TestBed.inject(AgentSanteService);
    specialiteService = TestBed.inject(SpecialiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Specialite query and add missing value', () => {
      const agentSante: IAgentSante = { id: 456 };
      const specialites: ISpecialite[] = [{ id: 99865 }];
      agentSante.specialites = specialites;

      const specialiteCollection: ISpecialite[] = [{ id: 61004 }];
      jest.spyOn(specialiteService, 'query').mockReturnValue(of(new HttpResponse({ body: specialiteCollection })));
      const additionalSpecialites = [...specialites];
      const expectedCollection: ISpecialite[] = [...additionalSpecialites, ...specialiteCollection];
      jest.spyOn(specialiteService, 'addSpecialiteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agentSante });
      comp.ngOnInit();

      expect(specialiteService.query).toHaveBeenCalled();
      expect(specialiteService.addSpecialiteToCollectionIfMissing).toHaveBeenCalledWith(
        specialiteCollection,
        ...additionalSpecialites.map(expect.objectContaining)
      );
      expect(comp.specialitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const agentSante: IAgentSante = { id: 456 };
      const specialite: ISpecialite = { id: 4533 };
      agentSante.specialites = [specialite];

      activatedRoute.data = of({ agentSante });
      comp.ngOnInit();

      expect(comp.specialitesSharedCollection).toContain(specialite);
      expect(comp.agentSante).toEqual(agentSante);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentSante>>();
      const agentSante = { id: 123 };
      jest.spyOn(agentSanteFormService, 'getAgentSante').mockReturnValue(agentSante);
      jest.spyOn(agentSanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentSante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentSante }));
      saveSubject.complete();

      // THEN
      expect(agentSanteFormService.getAgentSante).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(agentSanteService.update).toHaveBeenCalledWith(expect.objectContaining(agentSante));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentSante>>();
      const agentSante = { id: 123 };
      jest.spyOn(agentSanteFormService, 'getAgentSante').mockReturnValue({ id: null });
      jest.spyOn(agentSanteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentSante: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agentSante }));
      saveSubject.complete();

      // THEN
      expect(agentSanteFormService.getAgentSante).toHaveBeenCalled();
      expect(agentSanteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgentSante>>();
      const agentSante = { id: 123 };
      jest.spyOn(agentSanteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agentSante });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agentSanteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSpecialite', () => {
      it('Should forward to specialiteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(specialiteService, 'compareSpecialite');
        comp.compareSpecialite(entity, entity2);
        expect(specialiteService.compareSpecialite).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
