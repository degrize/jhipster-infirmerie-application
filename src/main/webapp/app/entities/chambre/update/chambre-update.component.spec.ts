import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ChambreFormService } from './chambre-form.service';
import { ChambreService } from '../service/chambre.service';
import { IChambre } from '../chambre.model';
import { IBatiment } from 'app/entities/batiment/batiment.model';
import { BatimentService } from 'app/entities/batiment/service/batiment.service';

import { ChambreUpdateComponent } from './chambre-update.component';

describe('Chambre Management Update Component', () => {
  let comp: ChambreUpdateComponent;
  let fixture: ComponentFixture<ChambreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chambreFormService: ChambreFormService;
  let chambreService: ChambreService;
  let batimentService: BatimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ChambreUpdateComponent],
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
      .overrideTemplate(ChambreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChambreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chambreFormService = TestBed.inject(ChambreFormService);
    chambreService = TestBed.inject(ChambreService);
    batimentService = TestBed.inject(BatimentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Batiment query and add missing value', () => {
      const chambre: IChambre = { id: 456 };
      const batiment: IBatiment = { id: 31425 };
      chambre.batiment = batiment;

      const batimentCollection: IBatiment[] = [{ id: 73544 }];
      jest.spyOn(batimentService, 'query').mockReturnValue(of(new HttpResponse({ body: batimentCollection })));
      const additionalBatiments = [batiment];
      const expectedCollection: IBatiment[] = [...additionalBatiments, ...batimentCollection];
      jest.spyOn(batimentService, 'addBatimentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ chambre });
      comp.ngOnInit();

      expect(batimentService.query).toHaveBeenCalled();
      expect(batimentService.addBatimentToCollectionIfMissing).toHaveBeenCalledWith(
        batimentCollection,
        ...additionalBatiments.map(expect.objectContaining)
      );
      expect(comp.batimentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const chambre: IChambre = { id: 456 };
      const batiment: IBatiment = { id: 11611 };
      chambre.batiment = batiment;

      activatedRoute.data = of({ chambre });
      comp.ngOnInit();

      expect(comp.batimentsSharedCollection).toContain(batiment);
      expect(comp.chambre).toEqual(chambre);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChambre>>();
      const chambre = { id: 123 };
      jest.spyOn(chambreFormService, 'getChambre').mockReturnValue(chambre);
      jest.spyOn(chambreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chambre }));
      saveSubject.complete();

      // THEN
      expect(chambreFormService.getChambre).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(chambreService.update).toHaveBeenCalledWith(expect.objectContaining(chambre));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChambre>>();
      const chambre = { id: 123 };
      jest.spyOn(chambreFormService, 'getChambre').mockReturnValue({ id: null });
      jest.spyOn(chambreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambre: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chambre }));
      saveSubject.complete();

      // THEN
      expect(chambreFormService.getChambre).toHaveBeenCalled();
      expect(chambreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IChambre>>();
      const chambre = { id: 123 };
      jest.spyOn(chambreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chambre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chambreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBatiment', () => {
      it('Should forward to batimentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(batimentService, 'compareBatiment');
        comp.compareBatiment(entity, entity2);
        expect(batimentService.compareBatiment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
