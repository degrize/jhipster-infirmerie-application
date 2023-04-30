import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { RdvService } from '../service/rdv.service';

import { RdvComponent } from './rdv.component';

describe('Rdv Management Component', () => {
  let comp: RdvComponent;
  let fixture: ComponentFixture<RdvComponent>;
  let service: RdvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'rdv', component: RdvComponent }]), HttpClientTestingModule],
      declarations: [RdvComponent],
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
      .overrideTemplate(RdvComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RdvComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RdvService);

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
    expect(comp.rdvs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to rdvService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getRdvIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getRdvIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
