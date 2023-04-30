import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypePathologie } from '../type-pathologie.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type-pathologie.test-samples';

import { TypePathologieService } from './type-pathologie.service';

const requireRestSample: ITypePathologie = {
  ...sampleWithRequiredData,
};

describe('TypePathologie Service', () => {
  let service: TypePathologieService;
  let httpMock: HttpTestingController;
  let expectedResult: ITypePathologie | ITypePathologie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypePathologieService);
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

    it('should create a TypePathologie', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const typePathologie = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(typePathologie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypePathologie', () => {
      const typePathologie = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(typePathologie).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypePathologie', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypePathologie', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TypePathologie', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypePathologieToCollectionIfMissing', () => {
      it('should add a TypePathologie to an empty array', () => {
        const typePathologie: ITypePathologie = sampleWithRequiredData;
        expectedResult = service.addTypePathologieToCollectionIfMissing([], typePathologie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePathologie);
      });

      it('should not add a TypePathologie to an array that contains it', () => {
        const typePathologie: ITypePathologie = sampleWithRequiredData;
        const typePathologieCollection: ITypePathologie[] = [
          {
            ...typePathologie,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypePathologieToCollectionIfMissing(typePathologieCollection, typePathologie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypePathologie to an array that doesn't contain it", () => {
        const typePathologie: ITypePathologie = sampleWithRequiredData;
        const typePathologieCollection: ITypePathologie[] = [sampleWithPartialData];
        expectedResult = service.addTypePathologieToCollectionIfMissing(typePathologieCollection, typePathologie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePathologie);
      });

      it('should add only unique TypePathologie to an array', () => {
        const typePathologieArray: ITypePathologie[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typePathologieCollection: ITypePathologie[] = [sampleWithRequiredData];
        expectedResult = service.addTypePathologieToCollectionIfMissing(typePathologieCollection, ...typePathologieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typePathologie: ITypePathologie = sampleWithRequiredData;
        const typePathologie2: ITypePathologie = sampleWithPartialData;
        expectedResult = service.addTypePathologieToCollectionIfMissing([], typePathologie, typePathologie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePathologie);
        expect(expectedResult).toContain(typePathologie2);
      });

      it('should accept null and undefined values', () => {
        const typePathologie: ITypePathologie = sampleWithRequiredData;
        expectedResult = service.addTypePathologieToCollectionIfMissing([], null, typePathologie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePathologie);
      });

      it('should return initial array if no TypePathologie is added', () => {
        const typePathologieCollection: ITypePathologie[] = [sampleWithRequiredData];
        expectedResult = service.addTypePathologieToCollectionIfMissing(typePathologieCollection, undefined, null);
        expect(expectedResult).toEqual(typePathologieCollection);
      });
    });

    describe('compareTypePathologie', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTypePathologie(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTypePathologie(entity1, entity2);
        const compareResult2 = service.compareTypePathologie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTypePathologie(entity1, entity2);
        const compareResult2 = service.compareTypePathologie(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTypePathologie(entity1, entity2);
        const compareResult2 = service.compareTypePathologie(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
