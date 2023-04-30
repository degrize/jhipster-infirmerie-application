import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClasseService } from '../service/classe.service';

import { ClasseComponent } from './classe.component';

describe('Classe Management Component', () => {
  let comp: ClasseComponent;
  let fixture: ComponentFixture<ClasseComponent>;
  let service: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'classe', component: ClasseComponent }]), HttpClientTestingModule],
      declarations: [ClasseComponent],
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
      .overrideTemplate(ClasseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClasseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ClasseService);

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
    expect(comp.classes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to classeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getClasseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getClasseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
