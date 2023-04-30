import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SiteFormService } from './site-form.service';
import { SiteService } from '../service/site.service';
import { ISite } from '../site.model';

import { SiteUpdateComponent } from './site-update.component';

describe('Site Management Update Component', () => {
  let comp: SiteUpdateComponent;
  let fixture: ComponentFixture<SiteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let siteFormService: SiteFormService;
  let siteService: SiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SiteUpdateComponent],
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
      .overrideTemplate(SiteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SiteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    siteFormService = TestBed.inject(SiteFormService);
    siteService = TestBed.inject(SiteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const site: ISite = { id: 456 };

      activatedRoute.data = of({ site });
      comp.ngOnInit();

      expect(comp.site).toEqual(site);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISite>>();
      const site = { id: 123 };
      jest.spyOn(siteFormService, 'getSite').mockReturnValue(site);
      jest.spyOn(siteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ site });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: site }));
      saveSubject.complete();

      // THEN
      expect(siteFormService.getSite).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(siteService.update).toHaveBeenCalledWith(expect.objectContaining(site));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISite>>();
      const site = { id: 123 };
      jest.spyOn(siteFormService, 'getSite').mockReturnValue({ id: null });
      jest.spyOn(siteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ site: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: site }));
      saveSubject.complete();

      // THEN
      expect(siteFormService.getSite).toHaveBeenCalled();
      expect(siteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISite>>();
      const site = { id: 123 };
      jest.spyOn(siteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ site });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(siteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
