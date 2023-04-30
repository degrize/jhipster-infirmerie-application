import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAntecedent } from '../antecedent.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../antecedent.test-samples';

import { AntecedentService } from './antecedent.service';

const requireRestSample: IAntecedent = {
  ...sampleWithRequiredData,
};

describe('Antecedent Service', () => {
  let service: AntecedentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAntecedent | IAntecedent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AntecedentService);
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

    it('should create a Antecedent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const antecedent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(antecedent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Antecedent', () => {
      const antecedent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(antecedent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Antecedent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Antecedent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Antecedent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAntecedentToCollectionIfMissing', () => {
      it('should add a Antecedent to an empty array', () => {
        const antecedent: IAntecedent = sampleWithRequiredData;
        expectedResult = service.addAntecedentToCollectionIfMissing([], antecedent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(antecedent);
      });

      it('should not add a Antecedent to an array that contains it', () => {
        const antecedent: IAntecedent = sampleWithRequiredData;
        const antecedentCollection: IAntecedent[] = [
          {
            ...antecedent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAntecedentToCollectionIfMissing(antecedentCollection, antecedent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Antecedent to an array that doesn't contain it", () => {
        const antecedent: IAntecedent = sampleWithRequiredData;
        const antecedentCollection: IAntecedent[] = [sampleWithPartialData];
        expectedResult = service.addAntecedentToCollectionIfMissing(antecedentCollection, antecedent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(antecedent);
      });

      it('should add only unique Antecedent to an array', () => {
        const antecedentArray: IAntecedent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const antecedentCollection: IAntecedent[] = [sampleWithRequiredData];
        expectedResult = service.addAntecedentToCollectionIfMissing(antecedentCollection, ...antecedentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const antecedent: IAntecedent = sampleWithRequiredData;
        const antecedent2: IAntecedent = sampleWithPartialData;
        expectedResult = service.addAntecedentToCollectionIfMissing([], antecedent, antecedent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(antecedent);
        expect(expectedResult).toContain(antecedent2);
      });

      it('should accept null and undefined values', () => {
        const antecedent: IAntecedent = sampleWithRequiredData;
        expectedResult = service.addAntecedentToCollectionIfMissing([], null, antecedent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(antecedent);
      });

      it('should return initial array if no Antecedent is added', () => {
        const antecedentCollection: IAntecedent[] = [sampleWithRequiredData];
        expectedResult = service.addAntecedentToCollectionIfMissing(antecedentCollection, undefined, null);
        expect(expectedResult).toEqual(antecedentCollection);
      });
    });

    describe('compareAntecedent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAntecedent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAntecedent(entity1, entity2);
        const compareResult2 = service.compareAntecedent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAntecedent(entity1, entity2);
        const compareResult2 = service.compareAntecedent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAntecedent(entity1, entity2);
        const compareResult2 = service.compareAntecedent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
