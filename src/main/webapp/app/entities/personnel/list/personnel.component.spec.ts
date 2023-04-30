import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PersonnelService } from '../service/personnel.service';

import { PersonnelComponent } from './personnel.component';

describe('Personnel Management Component', () => {
  let comp: PersonnelComponent;
  let fixture: ComponentFixture<PersonnelComponent>;
  let service: PersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'personnel', component: PersonnelComponent }]), HttpClientTestingModule],
      declarations: [PersonnelComponent],
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
      .overrideTemplate(PersonnelComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonnelComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PersonnelService);

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
    expect(comp.personnel?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to personnelService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPersonnelIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPersonnelIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
