import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedicamentFormService } from './medicament-form.service';
import { MedicamentService } from '../service/medicament.service';
import { IMedicament } from '../medicament.model';
import { ITypeMedicament } from 'app/entities/type-medicament/type-medicament.model';
import { TypeMedicamentService } from 'app/entities/type-medicament/service/type-medicament.service';
import { IOrdonnance } from 'app/entities/ordonnance/ordonnance.model';
import { OrdonnanceService } from 'app/entities/ordonnance/service/ordonnance.service';

import { MedicamentUpdateComponent } from './medicament-update.component';

describe('Medicament Management Update Component', () => {
  let comp: MedicamentUpdateComponent;
  let fixture: ComponentFixture<MedicamentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicamentFormService: MedicamentFormService;
  let medicamentService: MedicamentService;
  let typeMedicamentService: TypeMedicamentService;
  let ordonnanceService: OrdonnanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MedicamentUpdateComponent],
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
      .overrideTemplate(MedicamentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicamentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicamentFormService = TestBed.inject(MedicamentFormService);
    medicamentService = TestBed.inject(MedicamentService);
    typeMedicamentService = TestBed.inject(TypeMedicamentService);
    ordonnanceService = TestBed.inject(OrdonnanceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeMedicament query and add missing value', () => {
      const medicament: IMedicament = { id: 456 };
      const typeMedicament: ITypeMedicament = { id: 89494 };
      medicament.typeMedicament = typeMedicament;

      const typeMedicamentCollection: ITypeMedicament[] = [{ id: 28630 }];
      jest.spyOn(typeMedicamentService, 'query').mockReturnValue(of(new HttpResponse({ body: typeMedicamentCollection })));
      const additionalTypeMedicaments = [typeMedicament];
      const expectedCollection: ITypeMedicament[] = [...additionalTypeMedicaments, ...typeMedicamentCollection];
      jest.spyOn(typeMedicamentService, 'addTypeMedicamentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medicament });
      comp.ngOnInit();

      expect(typeMedicamentService.query).toHaveBeenCalled();
      expect(typeMedicamentService.addTypeMedicamentToCollectionIfMissing).toHaveBeenCalledWith(
        typeMedicamentCollection,
        ...additionalTypeMedicaments.map(expect.objectContaining)
      );
      expect(comp.typeMedicamentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ordonnance query and add missing value', () => {
      const medicament: IMedicament = { id: 456 };
      const ordonnance: IOrdonnance = { id: 66088 };
      medicament.ordonnance = ordonnance;

      const ordonnanceCollection: IOrdonnance[] = [{ id: 39733 }];
      jest.spyOn(ordonnanceService, 'query').mockReturnValue(of(new HttpResponse({ body: ordonnanceCollection })));
      const additionalOrdonnances = [ordonnance];
      const expectedCollection: IOrdonnance[] = [...additionalOrdonnances, ...ordonnanceCollection];
      jest.spyOn(ordonnanceService, 'addOrdonnanceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medicament });
      comp.ngOnInit();

      expect(ordonnanceService.query).toHaveBeenCalled();
      expect(ordonnanceService.addOrdonnanceToCollectionIfMissing).toHaveBeenCalledWith(
        ordonnanceCollection,
        ...additionalOrdonnances.map(expect.objectContaining)
      );
      expect(comp.ordonnancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const medicament: IMedicament = { id: 456 };
      const typeMedicament: ITypeMedicament = { id: 74656 };
      medicament.typeMedicament = typeMedicament;
      const ordonnance: IOrdonnance = { id: 89023 };
      medicament.ordonnance = ordonnance;

      activatedRoute.data = of({ medicament });
      comp.ngOnInit();

      expect(comp.typeMedicamentsSharedCollection).toContain(typeMedicament);
      expect(comp.ordonnancesSharedCollection).toContain(ordonnance);
      expect(comp.medicament).toEqual(medicament);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicament>>();
      const medicament = { id: 123 };
      jest.spyOn(medicamentFormService, 'getMedicament').mockReturnValue(medicament);
      jest.spyOn(medicamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicament }));
      saveSubject.complete();

      // THEN
      expect(medicamentFormService.getMedicament).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicamentService.update).toHaveBeenCalledWith(expect.objectContaining(medicament));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicament>>();
      const medicament = { id: 123 };
      jest.spyOn(medicamentFormService, 'getMedicament').mockReturnValue({ id: null });
      jest.spyOn(medicamentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicament: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicament }));
      saveSubject.complete();

      // THEN
      expect(medicamentFormService.getMedicament).toHaveBeenCalled();
      expect(medicamentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicament>>();
      const medicament = { id: 123 };
      jest.spyOn(medicamentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicament });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicamentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTypeMedicament', () => {
      it('Should forward to typeMedicamentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(typeMedicamentService, 'compareTypeMedicament');
        comp.compareTypeMedicament(entity, entity2);
        expect(typeMedicamentService.compareTypeMedicament).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareOrdonnance', () => {
      it('Should forward to ordonnanceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(ordonnanceService, 'compareOrdonnance');
        comp.compareOrdonnance(entity, entity2);
        expect(ordonnanceService.compareOrdonnance).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
