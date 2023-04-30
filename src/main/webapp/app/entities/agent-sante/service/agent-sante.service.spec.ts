import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAgentSante } from '../agent-sante.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../agent-sante.test-samples';

import { AgentSanteService } from './agent-sante.service';

const requireRestSample: IAgentSante = {
  ...sampleWithRequiredData,
};

describe('AgentSante Service', () => {
  let service: AgentSanteService;
  let httpMock: HttpTestingController;
  let expectedResult: IAgentSante | IAgentSante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AgentSanteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AgentSante', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const agentSante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(agentSante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AgentSante', () => {
      const agentSante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(agentSante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AgentSante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AgentSante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AgentSante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAgentSanteToCollectionIfMissing', () => {
      it('should add a AgentSante to an empty array', () => {
        const agentSante: IAgentSante = sampleWithRequiredData;
        expectedResult = service.addAgentSanteToCollectionIfMissing([], agentSante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agentSante);
      });

      it('should not add a AgentSante to an array that contains it', () => {
        const agentSante: IAgentSante = sampleWithRequiredData;
        const agentSanteCollection: IAgentSante[] = [
          {
            ...agentSante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAgentSanteToCollectionIfMissing(agentSanteCollection, agentSante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AgentSante to an array that doesn't contain it", () => {
        const agentSante: IAgentSante = sampleWithRequiredData;
        const agentSanteCollection: IAgentSante[] = [sampleWithPartialData];
        expectedResult = service.addAgentSanteToCollectionIfMissing(agentSanteCollection, agentSante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agentSante);
      });

      it('should add only unique AgentSante to an array', () => {
        const agentSanteArray: IAgentSante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const agentSanteCollection: IAgentSante[] = [sampleWithRequiredData];
        expectedResult = service.addAgentSanteToCollectionIfMissing(agentSanteCollection, ...agentSanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const agentSante: IAgentSante = sampleWithRequiredData;
        const agentSante2: IAgentSante = sampleWithPartialData;
        expectedResult = service.addAgentSanteToCollectionIfMissing([], agentSante, agentSante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(agentSante);
        expect(expectedResult).toContain(agentSante2);
      });

      it('should accept null and undefined values', () => {
        const agentSante: IAgentSante = sampleWithRequiredData;
        expectedResult = service.addAgentSanteToCollectionIfMissing([], null, agentSante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(agentSante);
      });

      it('should return initial array if no AgentSante is added', () => {
        const agentSanteCollection: IAgentSante[] = [sampleWithRequiredData];
        expectedResult = service.addAgentSanteToCollectionIfMissing(agentSanteCollection, undefined, null);
        expect(expectedResult).toEqual(agentSanteCollection);
      });
    });

    describe('compareAgentSante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAgentSante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAgentSante(entity1, entity2);
        const compareResult2 = service.compareAgentSante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAgentSante(entity1, entity2);
        const compareResult2 = service.compareAgentSante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAgentSante(entity1, entity2);
        const compareResult2 = service.compareAgentSante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
