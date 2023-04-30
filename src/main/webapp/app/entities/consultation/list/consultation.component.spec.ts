import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConsultationService } from '../service/consultation.service';

import { ConsultationComponent } from './consultation.component';

describe('Consultation Management Component', () => {
  let comp: ConsultationComponent;
  let fixture: ComponentFixture<ConsultationComponent>;
  let service: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'consultation', component: ConsultationComponent }]), HttpClientTestingModule],
      declarations: [ConsultationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ConsultationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsultationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConsultationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.consultations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to consultationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getConsultationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getConsultationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
