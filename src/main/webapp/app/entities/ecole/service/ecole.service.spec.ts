import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEcole } from '../ecole.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ecole.test-samples';

import { EcoleService } from './ecole.service';

const requireRestSample: IEcole = {
  ...sampleWithRequiredData,
};

describe('Ecole Service', () => {
  let service: EcoleService;
  let httpMock: HttpTestingController;
  let expectedResult: IEcole | IEcole[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EcoleService);
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

    it('should create a Ecole', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ecole = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ecole).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ecole', () => {
      const ecole = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ecole).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ecole', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ecole', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ecole', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEcoleToCollectionIfMissing', () => {
      it('should add a Ecole to an empty array', () => {
        const ecole: IEcole = sampleWithRequiredData;
        expectedResult = service.addEcoleToCollectionIfMissing([], ecole);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ecole);
      });

      it('should not add a Ecole to an array that contains it', () => {
        const ecole: IEcole = sampleWithRequiredData;
        const ecoleCollection: IEcole[] = [
          {
            ...ecole,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEcoleToCollectionIfMissing(ecoleCollection, ecole);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ecole to an array that doesn't contain it", () => {
        const ecole: IEcole = sampleWithRequiredData;
        const ecoleCollection: IEcole[] = [sampleWithPartialData];
        expectedResult = service.addEcoleToCollectionIfMissing(ecoleCollection, ecole);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ecole);
      });

      it('should add only unique Ecole to an array', () => {
        const ecoleArray: IEcole[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ecoleCollection: IEcole[] = [sampleWithRequiredData];
        expectedResult = service.addEcoleToCollectionIfMissing(ecoleCollection, ...ecoleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ecole: IEcole = sampleWithRequiredData;
        const ecole2: IEcole = sampleWithPartialData;
        expectedResult = service.addEcoleToCollectionIfMissing([], ecole, ecole2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ecole);
        expect(expectedResult).toContain(ecole2);
      });

      it('should accept null and undefined values', () => {
        const ecole: IEcole = sampleWithRequiredData;
        expectedResult = service.addEcoleToCollectionIfMissing([], null, ecole, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ecole);
      });

      it('should return initial array if no Ecole is added', () => {
        const ecoleCollection: IEcole[] = [sampleWithRequiredData];
        expectedResult = service.addEcoleToCollectionIfMissing(ecoleCollection, undefined, null);
        expect(expectedResult).toEqual(ecoleCollection);
      });
    });

    describe('compareEcole', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEcole(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEcole(entity1, entity2);
        const compareResult2 = service.compareEcole(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEcole(entity1, entity2);
        const compareResult2 = service.compareEcole(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEcole(entity1, entity2);
        const compareResult2 = service.compareEcole(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
