import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BatimentService } from '../service/batiment.service';

import { BatimentComponent } from './batiment.component';

describe('Batiment Management Component', () => {
  let comp: BatimentComponent;
  let fixture: ComponentFixture<BatimentComponent>;
  let service: BatimentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'batiment', component: BatimentComponent }]), HttpClientTestingModule],
      declarations: [BatimentComponent],
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
      .overrideTemplate(BatimentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BatimentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BatimentService);

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
    expect(comp.batiments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to batimentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBatimentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBatimentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
