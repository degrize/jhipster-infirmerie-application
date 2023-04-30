import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeAgent } from '../type-agent.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type-agent.test-samples';

import { TypeAgentService } from './type-agent.service';

const requireRestSample: ITypeAgent = {
  ...sampleWithRequiredData,
};

describe('TypeAgent Service', () => {
  let service: TypeAgentService;
  let httpMock: HttpTestingController;
  let expectedResult: ITypeAgent | ITypeAgent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeAgentService);
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

    it('should create a TypeAgent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const typeAgent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(typeAgent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeAgent', () => {
      const typeAgent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(typeAgent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeAgent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeAgent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TypeAgent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypeAgentToCollectionIfMissing', () => {
      it('should add a TypeAgent to an empty array', () => {
        const typeAgent: ITypeAgent = sampleWithRequiredData;
        expectedResult = service.addTypeAgentToCollectionIfMissing([], typeAgent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeAgent);
      });

      it('should not add a TypeAgent to an array that contains it', () => {
        const typeAgent: ITypeAgent = sampleWithRequiredData;
        const typeAgentCollection: ITypeAgent[] = [
          {
            ...typeAgent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypeAgentToCollectionIfMissing(typeAgentCollection, typeAgent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeAgent to an array that doesn't contain it", () => {
        const typeAgent: ITypeAgent = sampleWithRequiredData;
        const typeAgentCollection: ITypeAgent[] = [sampleWithPartialData];
        expectedResult = service.addTypeAgentToCollectionIfMissing(typeAgentCollection, typeAgent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeAgent);
      });

      it('should add only unique TypeAgent to an array', () => {
        const typeAgentArray: ITypeAgent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typeAgentCollection: ITypeAgent[] = [sampleWithRequiredData];
        expectedResult = service.addTypeAgentToCollectionIfMissing(typeAgentCollection, ...typeAgentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeAgent: ITypeAgent = sampleWithRequiredData;
        const typeAgent2: ITypeAgent = sampleWithPartialData;
        expectedResult = service.addTypeAgentToCollectionIfMissing([], typeAgent, typeAgent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeAgent);
        expect(expectedResult).toContain(typeAgent2);
      });

      it('should accept null and undefined values', () => {
        const typeAgent: ITypeAgent = sampleWithRequiredData;
        expectedResult = service.addTypeAgentToCollectionIfMissing([], null, typeAgent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeAgent);
      });

      it('should return initial array if no TypeAgent is added', () => {
        const typeAgentCollection: ITypeAgent[] = [sampleWithRequiredData];
        expectedResult = service.addTypeAgentToCollectionIfMissing(typeAgentCollection, undefined, null);
        expect(expectedResult).toEqual(typeAgentCollection);
      });
    });

    describe('compareTypeAgent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTypeAgent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTypeAgent(entity1, entity2);
        const compareResult2 = service.compareTypeAgent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTypeAgent(entity1, entity2);
        const compareResult2 = service.compareTypeAgent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTypeAgent(entity1, entity2);
        const compareResult2 = service.compareTypeAgent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
