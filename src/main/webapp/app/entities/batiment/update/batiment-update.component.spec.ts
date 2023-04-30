import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BatimentFormService } from './batiment-form.service';
import { BatimentService } from '../service/batiment.service';
import { IBatiment } from '../batiment.model';
import { ISite } from 'app/entities/site/site.model';
import { SiteService } from 'app/entities/site/service/site.service';

import { BatimentUpdateComponent } from './batiment-update.component';

describe('Batiment Management Update Component', () => {
  let comp: BatimentUpdateComponent;
  let fixture: ComponentFixture<BatimentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let batimentFormService: BatimentFormService;
  let batimentService: BatimentService;
  let siteService: SiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BatimentUpdateComponent],
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
      .overrideTemplate(BatimentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BatimentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    batimentFormService = TestBed.inject(BatimentFormService);
    batimentService = TestBed.inject(BatimentService);
    siteService = TestBed.inject(SiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Site query and add missing value', () => {
      const batiment: IBatiment = { id: 456 };
      const site: ISite = { id: 29922 };
      batiment.site = site;

      const siteCollection: ISite[] = [{ id: 71743 }];
      jest.spyOn(siteService, 'query').mockReturnValue(of(new HttpResponse({ body: siteCollection })));
      const additionalSites = [site];
      const expectedCollection: ISite[] = [...additionalSites, ...siteCollection];
      jest.spyOn(siteService, 'addSiteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ batiment });
      comp.ngOnInit();

      expect(siteService.query).toHaveBeenCalled();
      expect(siteService.addSiteToCollectionIfMissing).toHaveBeenCalledWith(
        siteCollection,
        ...additionalSites.map(expect.objectContaining)
      );
      expect(comp.sitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const batiment: IBatiment = { id: 456 };
      const site: ISite = { id: 53684 };
      batiment.site = site;

      activatedRoute.data = of({ batiment });
      comp.ngOnInit();

      expect(comp.sitesSharedCollection).toContain(site);
      expect(comp.batiment).toEqual(batiment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBatiment>>();
      const batiment = { id: 123 };
      jest.spyOn(batimentFormService, 'getBatiment').mockReturnValue(batiment);
      jest.spyOn(batimentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ batiment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: batiment }));
      saveSubject.complete();

      // THEN
      expect(batimentFormService.getBatiment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(batimentService.update).toHaveBeenCalledWith(expect.objectContaining(batiment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBatiment>>();
      const batiment = { id: 123 };
      jest.spyOn(batimentFormService, 'getBatiment').mockReturnValue({ id: null });
      jest.spyOn(batimentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ batiment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: batiment }));
      saveSubject.complete();

      // THEN
      expect(batimentFormService.getBatiment).toHaveBeenCalled();
      expect(batimentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBatiment>>();
      const batiment = { id: 123 };
      jest.spyOn(batimentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ batiment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(batimentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSite', () => {
      it('Should forward to siteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(siteService, 'compareSite');
        comp.compareSite(entity, entity2);
        expect(siteService.compareSite).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
