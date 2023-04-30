import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MiseEnObservationService } from '../service/mise-en-observation.service';

import { MiseEnObservationComponent } from './mise-en-observation.component';

describe('MiseEnObservation Management Component', () => {
  let comp: MiseEnObservationComponent;
  let fixture: ComponentFixture<MiseEnObservationComponent>;
  let service: MiseEnObservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mise-en-observation', component: MiseEnObservationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MiseEnObservationComponent],
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
      .overrideTemplate(MiseEnObservationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MiseEnObservationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MiseEnObservationService);

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
    expect(comp.miseEnObservations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to miseEnObservationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMiseEnObservationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMiseEnObservationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
