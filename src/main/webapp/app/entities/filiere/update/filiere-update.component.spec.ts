import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FiliereFormService } from './filiere-form.service';
import { FiliereService } from '../service/filiere.service';
import { IFiliere } from '../filiere.model';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { IEcole } from 'app/entities/ecole/ecole.model';
import { EcoleService } from 'app/entities/ecole/service/ecole.service';

import { FiliereUpdateComponent } from './filiere-update.component';

describe('Filiere Management Update Component', () => {
  let comp: FiliereUpdateComponent;
  let fixture: ComponentFixture<FiliereUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let filiereFormService: FiliereFormService;
  let filiereService: FiliereService;
  let classeService: ClasseService;
  let ecoleService: EcoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FiliereUpdateComponent],
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
      .overrideTemplate(FiliereUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FiliereUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    filiereFormService = TestBed.inject(FiliereFormService);
    filiereService = TestBed.inject(FiliereService);
    classeService = TestBed.inject(ClasseService);
    ecoleService = TestBed.inject(EcoleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Classe query and add missing value', () => {
      const filiere: IFiliere = { id: 456 };
      const classe: IClasse = { id: 80541 };
      filiere.classe = classe;

      const classeCollection: IClasse[] = [{ id: 66706 }];
      jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
      const additionalClasses = [classe];
      const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
      jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ filiere });
      comp.ngOnInit();

      expect(classeService.query).toHaveBeenCalled();
      expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(
        classeCollection,
        ...additionalClasses.map(expect.objectContaining)
      );
      expect(comp.classesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ecole query and add missing value', () => {
      const filiere: IFiliere = { id: 456 };
      const ecole: IEcole = { id: 86432 };
      filiere.ecole = ecole;

      const ecoleCollection: IEcole[] = [{ id: 15194 }];
      jest.spyOn(ecoleService, 'query').mockReturnValue(of(new HttpResponse({ body: ecoleCollection })));
      const additionalEcoles = [ecole];
      const expectedCollection: IEcole[] = [...additionalEcoles, ...ecoleCollection];
      jest.spyOn(ecoleService, 'addEcoleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ filiere });
      comp.ngOnInit();

      expect(ecoleService.query).toHaveBeenCalled();
      expect(ecoleService.addEcoleToCollectionIfMissing).toHaveBeenCalledWith(
        ecoleCollection,
        ...additionalEcoles.map(expect.objectContaining)
      );
      expect(comp.ecolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const filiere: IFiliere = { id: 456 };
      const classe: IClasse = { id: 93515 };
      filiere.classe = classe;
      const ecole: IEcole = { id: 53774 };
      filiere.ecole = ecole;

      activatedRoute.data = of({ filiere });
      comp.ngOnInit();

      expect(comp.classesSharedCollection).toContain(classe);
      expect(comp.ecolesSharedCollection).toContain(ecole);
      expect(comp.filiere).toEqual(filiere);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiliere>>();
      const filiere = { id: 123 };
      jest.spyOn(filiereFormService, 'getFiliere').mockReturnValue(filiere);
      jest.spyOn(filiereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filiere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filiere }));
      saveSubject.complete();

      // THEN
      expect(filiereFormService.getFiliere).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(filiereService.update).toHaveBeenCalledWith(expect.objectContaining(filiere));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiliere>>();
      const filiere = { id: 123 };
      jest.spyOn(filiereFormService, 'getFiliere').mockReturnValue({ id: null });
      jest.spyOn(filiereService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filiere: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: filiere }));
      saveSubject.complete();

      // THEN
      expect(filiereFormService.getFiliere).toHaveBeenCalled();
      expect(filiereService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFiliere>>();
      const filiere = { id: 123 };
      jest.spyOn(filiereService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ filiere });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(filiereService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClasse', () => {
      it('Should forward to classeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(classeService, 'compareClasse');
        comp.compareClasse(entity, entity2);
        expect(classeService.compareClasse).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEcole', () => {
      it('Should forward to ecoleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ecoleService, 'compareEcole');
        comp.compareEcole(entity, entity2);
        expect(ecoleService.compareEcole).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
