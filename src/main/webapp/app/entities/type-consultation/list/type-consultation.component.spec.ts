import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeConsultationService } from '../service/type-consultation.service';

import { TypeConsultationComponent } from './type-consultation.component';

describe('TypeConsultation Management Component', () => {
  let comp: TypeConsultationComponent;
  let fixture: ComponentFixture<TypeConsultationComponent>;
  let service: TypeConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'type-consultation', component: TypeConsultationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [TypeConsultationComponent],
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
      .overrideTemplate(TypeConsultationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeConsultationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypeConsultationService);

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
    expect(comp.typeConsultations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to typeConsultationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTypeConsultationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTypeConsultationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
