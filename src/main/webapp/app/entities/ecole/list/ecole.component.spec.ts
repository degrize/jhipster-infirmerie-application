import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EcoleService } from '../service/ecole.service';

import { EcoleComponent } from './ecole.component';

describe('Ecole Management Component', () => {
  let comp: EcoleComponent;
  let fixture: ComponentFixture<EcoleComponent>;
  let service: EcoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'ecole', component: EcoleComponent }]), HttpClientTestingModule],
      declarations: [EcoleComponent],
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
      .overrideTemplate(EcoleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EcoleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EcoleService);

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
    expect(comp.ecoles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to ecoleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEcoleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEcoleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
