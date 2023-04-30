import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeAgentService } from '../service/type-agent.service';

import { TypeAgentComponent } from './type-agent.component';

describe('TypeAgent Management Component', () => {
  let comp: TypeAgentComponent;
  let fixture: ComponentFixture<TypeAgentComponent>;
  let service: TypeAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'type-agent', component: TypeAgentComponent }]), HttpClientTestingModule],
      declarations: [TypeAgentComponent],
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
      .overrideTemplate(TypeAgentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeAgentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TypeAgentService);

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
    expect(comp.typeAgents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to typeAgentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTypeAgentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTypeAgentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
