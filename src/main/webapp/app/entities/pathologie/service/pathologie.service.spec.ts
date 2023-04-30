import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPathologie } from '../pathologie.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pathologie.test-samples';

import { PathologieService } from './pathologie.service';

const requireRestSample: IPathologie = {
  ...sampleWithRequiredData,
};

describe('Pathologie Service', () => {
  let service: PathologieService;
  let httpMock: HttpTestingController;
  let expectedResult: IPathologie | IPathologie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PathologieService);
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

    it('should create a Pathologie', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pathologie = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pathologie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pathologie', () => {
      const pathologie = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pathologie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pathologie', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pathologie', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pathologie', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPathologieToCollectionIfMissing', () => {
      it('should add a Pathologie to an empty array', () => {
        const pathologie: IPathologie = sampleWithRequiredData;
        expectedResult = service.addPathologieToCollectionIfMissing([], pathologie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pathologie);
      });

      it('should not add a Pathologie to an array that contains it', () => {
        const pathologie: IPathologie = sampleWithRequiredData;
        const pathologieCollection: IPathologie[] = [
          {
            ...pathologie,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPathologieToCollectionIfMissing(pathologieCollection, pathologie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pathologie to an array that doesn't contain it", () => {
        const pathologie: IPathologie = sampleWithRequiredData;
        const pathologieCollection: IPathologie[] = [sampleWithPartialData];
        expectedResult = service.addPathologieToCollectionIfMissing(pathologieCollection, pathologie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pathologie);
      });

      it('should add only unique Pathologie to an array', () => {
        const pathologieArray: IPathologie[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pathologieCollection: IPathologie[] = [sampleWithRequiredData];
        expectedResult = service.addPathologieToCollectionIfMissing(pathologieCollection, ...pathologieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pathologie: IPathologie = sampleWithRequiredData;
        const pathologie2: IPathologie = sampleWithPartialData;
        expectedResult = service.addPathologieToCollectionIfMissing([], pathologie, pathologie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pathologie);
        expect(expectedResult).toContain(pathologie2);
      });

      it('should accept null and undefined values', () => {
        const pathologie: IPathologie = sampleWithRequiredData;
        expectedResult = service.addPathologieToCollectionIfMissing([], null, pathologie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pathologie);
      });

      it('should return initial array if no Pathologie is added', () => {
        const pathologieCollection: IPathologie[] = [sampleWithRequiredData];
        expectedResult = service.addPathologieToCollectionIfMissing(pathologieCollection, undefined, null);
        expect(expectedResult).toEqual(pathologieCollection);
      });
    });

    describe('comparePathologie', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePathologie(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePathologie(entity1, entity2);
        const compareResult2 = service.comparePathologie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePathologie(entity1, entity2);
        const compareResult2 = service.comparePathologie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePathologie(entity1, entity2);
        const compareResult2 = service.comparePathologie(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
