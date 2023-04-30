import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PathologieService } from '../service/pathologie.service';

import { PathologieComponent } from './pathologie.component';

describe('Pathologie Management Component', () => {
  let comp: PathologieComponent;
  let fixture: ComponentFixture<PathologieComponent>;
  let service: PathologieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pathologie', component: PathologieComponent }]), HttpClientTestingModule],
      declarations: [PathologieComponent],
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
      .overrideTemplate(PathologieComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PathologieComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PathologieService);

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
    expect(comp.pathologies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pathologieService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPathologieIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPathologieIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
