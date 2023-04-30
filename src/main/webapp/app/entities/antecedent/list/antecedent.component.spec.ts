import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AntecedentService } from '../service/antecedent.service';

import { AntecedentComponent } from './antecedent.component';

describe('Antecedent Management Component', () => {
  let comp: AntecedentComponent;
  let fixture: ComponentFixture<AntecedentComponent>;
  let service: AntecedentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'antecedent', component: AntecedentComponent }]), HttpClientTestingModule],
      declarations: [AntecedentComponent],
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
      .overrideTemplate(AntecedentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntecedentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AntecedentService);

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
    expect(comp.antecedents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to antecedentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAntecedentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAntecedentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
