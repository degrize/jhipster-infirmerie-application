import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeMedicamentService } from '../service/type-medicament.service';

import { TypeMedicamentComponent } from './type-medicament.component';

describe('TypeMedicament Management Component', () => {
  let comp: TypeMedicamentComponent;
  let fixture: ComponentFixture<TypeMedicamentComponent>;
  let service: TypeMedicamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'type-medicament', component: TypeMedicamentComponent }]), HttpClientTestingModule],
      declarations: [TypeMedicamentComponent],
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
      .overrideTemplate(TypeMedicamentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeMedicamentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypeMedicamentService);

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
    expect(comp.typeMedicaments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to typeMedicamentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTypeMedicamentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTypeMedicamentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
