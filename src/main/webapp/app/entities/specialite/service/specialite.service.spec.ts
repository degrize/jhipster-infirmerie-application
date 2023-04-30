import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpecialite } from '../specialite.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../specialite.test-samples';

import { SpecialiteService } from './specialite.service';

const requireRestSample: ISpecialite = {
  ...sampleWithRequiredData,
};

describe('Specialite Service', () => {
  let service: SpecialiteService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpecialite | ISpecialite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpecialiteService);
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

    it('should create a Specialite', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const specialite = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(specialite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Specialite', () => {
      const specialite = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(specialite).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Specialite', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Specialite', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Specialite', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSpecialiteToCollectionIfMissing', () => {
      it('should add a Specialite to an empty array', () => {
        const specialite: ISpecialite = sampleWithRequiredData;
        expectedResult = service.addSpecialiteToCollectionIfMissing([], specialite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialite);
      });

      it('should not add a Specialite to an array that contains it', () => {
        const specialite: ISpecialite = sampleWithRequiredData;
        const specialiteCollection: ISpecialite[] = [
          {
            ...specialite,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpecialiteToCollectionIfMissing(specialiteCollection, specialite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Specialite to an array that doesn't contain it", () => {
        const specialite: ISpecialite = sampleWithRequiredData;
        const specialiteCollection: ISpecialite[] = [sampleWithPartialData];
        expectedResult = service.addSpecialiteToCollectionIfMissing(specialiteCollection, specialite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialite);
      });

      it('should add only unique Specialite to an array', () => {
        const specialiteArray: ISpecialite[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const specialiteCollection: ISpecialite[] = [sampleWithRequiredData];
        expectedResult = service.addSpecialiteToCollectionIfMissing(specialiteCollection, ...specialiteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const specialite: ISpecialite = sampleWithRequiredData;
        const specialite2: ISpecialite = sampleWithPartialData;
        expectedResult = service.addSpecialiteToCollectionIfMissing([], specialite, specialite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialite);
        expect(expectedResult).toContain(specialite2);
      });

      it('should accept null and undefined values', () => {
        const specialite: ISpecialite = sampleWithRequiredData;
        expectedResult = service.addSpecialiteToCollectionIfMissing([], null, specialite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialite);
      });

      it('should return initial array if no Specialite is added', () => {
        const specialiteCollection: ISpecialite[] = [sampleWithRequiredData];
        expectedResult = service.addSpecialiteToCollectionIfMissing(specialiteCollection, undefined, null);
        expect(expectedResult).toEqual(specialiteCollection);
      });
    });

    describe('compareSpecialite', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpecialite(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpecialite(entity1, entity2);
        const compareResult2 = service.compareSpecialite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpecialite(entity1, entity2);
        const compareResult2 = service.compareSpecialite(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpecialite(entity1, entity2);
        const compareResult2 = service.compareSpecialite(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
