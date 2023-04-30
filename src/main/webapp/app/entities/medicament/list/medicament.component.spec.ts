import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MedicamentService } from '../service/medicament.service';

import { MedicamentComponent } from './medicament.component';

describe('Medicament Management Component', () => {
  let comp: MedicamentComponent;
  let fixture: ComponentFixture<MedicamentComponent>;
  let service: MedicamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'medicament', component: MedicamentComponent }]), HttpClientTestingModule],
      declarations: [MedicamentComponent],
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
      .overrideTemplate(MedicamentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicamentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicamentService);

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
    expect(comp.medicaments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to medicamentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMedicamentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMedicamentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
