import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PathologieFormService } from './pathologie-form.service';
import { PathologieService } from '../service/pathologie.service';
import { IPathologie } from '../pathologie.model';
import { ITypePathologie } from 'app/entities/type-pathologie/type-pathologie.model';
import { TypePathologieService } from 'app/entities/type-pathologie/service/type-pathologie.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { PathologieUpdateComponent } from './pathologie-update.component';

describe('Pathologie Management Update Component', () => {
  let comp: PathologieUpdateComponent;
  let fixture: ComponentFixture<PathologieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pathologieFormService: PathologieFormService;
  let pathologieService: PathologieService;
  let typePathologieService: TypePathologieService;
  let consultationService: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PathologieUpdateComponent],
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
      .overrideTemplate(PathologieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PathologieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pathologieFormService = TestBed.inject(PathologieFormService);
    pathologieService = TestBed.inject(PathologieService);
    typePathologieService = TestBed.inject(TypePathologieService);
    consultationService = TestBed.inject(ConsultationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypePathologie query and add missing value', () => {
      const pathologie: IPathologie = { id: 456 };
      const typePathologie: ITypePathologie = { id: 70221 };
      pathologie.typePathologie = typePathologie;

      const typePathologieCollection: ITypePathologie[] = [{ id: 90209 }];
      jest.spyOn(typePathologieService, 'query').mockReturnValue(of(new HttpResponse({ body: typePathologieCollection })));
      const additionalTypePathologies = [typePathologie];
      const expectedCollection: ITypePathologie[] = [...additionalTypePathologies, ...typePathologieCollection];
      jest.spyOn(typePathologieService, 'addTypePathologieToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pathologie });
      comp.ngOnInit();

      expect(typePathologieService.query).toHaveBeenCalled();
      expect(typePathologieService.addTypePathologieToCollectionIfMissing).toHaveBeenCalledWith(
        typePathologieCollection,
        ...additionalTypePathologies.map(expect.objectContaining)
      );
      expect(comp.typePathologiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Consultation query and add missing value', () => {
      const pathologie: IPathologie = { id: 456 };
      const consultations: IConsultation[] = [{ id: 92250 }];
      pathologie.consultations = consultations;

      const consultationCollection: IConsultation[] = [{ id: 68700 }];
      jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
      const additionalConsultations = [...consultations];
      const expectedCollection: IConsultation[] = [...additionalConsultations, ...consultationCollection];
      jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pathologie });
      comp.ngOnInit();

      expect(consultationService.query).toHaveBeenCalled();
      expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(
        consultationCollection,
        ...additionalConsultations.map(expect.objectContaining)
      );
      expect(comp.consultationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pathologie: IPathologie = { id: 456 };
      const typePathologie: ITypePathologie = { id: 39612 };
      pathologie.typePathologie = typePathologie;
      const consultation: IConsultation = { id: 62231 };
      pathologie.consultations = [consultation];

      activatedRoute.data = of({ pathologie });
      comp.ngOnInit();

      expect(comp.typePathologiesSharedCollection).toContain(typePathologie);
      expect(comp.consultationsSharedCollection).toContain(consultation);
      expect(comp.pathologie).toEqual(pathologie);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPathologie>>();
      const pathologie = { id: 123 };
      jest.spyOn(pathologieFormService, 'getPathologie').mockReturnValue(pathologie);
      jest.spyOn(pathologieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pathologie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pathologie }));
      saveSubject.complete();

      // THEN
      expect(pathologieFormService.getPathologie).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pathologieService.update).toHaveBeenCalledWith(expect.objectContaining(pathologie));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPathologie>>();
      const pathologie = { id: 123 };
      jest.spyOn(pathologieFormService, 'getPathologie').mockReturnValue({ id: null });
      jest.spyOn(pathologieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pathologie: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pathologie }));
      saveSubject.complete();

      // THEN
      expect(pathologieFormService.getPathologie).toHaveBeenCalled();
      expect(pathologieService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPathologie>>();
      const pathologie = { id: 123 };
      jest.spyOn(pathologieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pathologie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pathologieService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTypePathologie', () => {
      it('Should forward to typePathologieService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(typePathologieService, 'compareTypePathologie');
        comp.compareTypePathologie(entity, entity2);
        expect(typePathologieService.compareTypePathologie).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareConsultation', () => {
      it('Should forward to consultationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(consultationService, 'compareConsultation');
        comp.compareConsultation(entity, entity2);
        expect(consultationService.compareConsultation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
