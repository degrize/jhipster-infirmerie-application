import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CentreSanteService } from '../service/centre-sante.service';

import { CentreSanteComponent } from './centre-sante.component';

describe('CentreSante Management Component', () => {
  let comp: CentreSanteComponent;
  let fixture: ComponentFixture<CentreSanteComponent>;
  let service: CentreSanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'centre-sante', component: CentreSanteComponent }]), HttpClientTestingModule],
      declarations: [CentreSanteComponent],
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
      .overrideTemplate(CentreSanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CentreSanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CentreSanteService);

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
    expect(comp.centreSantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to centreSanteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCentreSanteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCentreSanteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
