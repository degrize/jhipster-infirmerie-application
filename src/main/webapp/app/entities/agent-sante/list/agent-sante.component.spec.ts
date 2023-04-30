import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AgentSanteService } from '../service/agent-sante.service';

import { AgentSanteComponent } from './agent-sante.component';

describe('AgentSante Management Component', () => {
  let comp: AgentSanteComponent;
  let fixture: ComponentFixture<AgentSanteComponent>;
  let service: AgentSanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'agent-sante', component: AgentSanteComponent }]), HttpClientTestingModule],
      declarations: [AgentSanteComponent],
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
      .overrideTemplate(AgentSanteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentSanteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AgentSanteService);

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
    expect(comp.agentSantes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to agentSanteService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAgentSanteIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAgentSanteIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
