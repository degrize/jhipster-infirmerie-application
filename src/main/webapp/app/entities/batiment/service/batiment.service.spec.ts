import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBatiment } from '../batiment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../batiment.test-samples';

import { BatimentService } from './batiment.service';

const requireRestSample: IBatiment = {
  ...sampleWithRequiredData,
};

describe('Batiment Service', () => {
  let service: BatimentService;
  let httpMock: HttpTestingController;
  let expectedResult: IBatiment | IBatiment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BatimentService);
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

    it('should create a Batiment', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const batiment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(batiment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Batiment', () => {
      const batiment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(batiment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Batiment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Batiment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Batiment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBatimentToCollectionIfMissing', () => {
      it('should add a Batiment to an empty array', () => {
        const batiment: IBatiment = sampleWithRequiredData;
        expectedResult = service.addBatimentToCollectionIfMissing([], batiment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(batiment);
      });

      it('should not add a Batiment to an array that contains it', () => {
        const batiment: IBatiment = sampleWithRequiredData;
        const batimentCollection: IBatiment[] = [
          {
            ...batiment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBatimentToCollectionIfMissing(batimentCollection, batiment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Batiment to an array that doesn't contain it", () => {
        const batiment: IBatiment = sampleWithRequiredData;
        const batimentCollection: IBatiment[] = [sampleWithPartialData];
        expectedResult = service.addBatimentToCollectionIfMissing(batimentCollection, batiment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(batiment);
      });

      it('should add only unique Batiment to an array', () => {
        const batimentArray: IBatiment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const batimentCollection: IBatiment[] = [sampleWithRequiredData];
        expectedResult = service.addBatimentToCollectionIfMissing(batimentCollection, ...batimentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const batiment: IBatiment = sampleWithRequiredData;
        const batiment2: IBatiment = sampleWithPartialData;
        expectedResult = service.addBatimentToCollectionIfMissing([], batiment, batiment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(batiment);
        expect(expectedResult).toContain(batiment2);
      });

      it('should accept null and undefined values', () => {
        const batiment: IBatiment = sampleWithRequiredData;
        expectedResult = service.addBatimentToCollectionIfMissing([], null, batiment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(batiment);
      });

      it('should return initial array if no Batiment is added', () => {
        const batimentCollection: IBatiment[] = [sampleWithRequiredData];
        expectedResult = service.addBatimentToCollectionIfMissing(batimentCollection, undefined, null);
        expect(expectedResult).toEqual(batimentCollection);
      });
    });

    describe('compareBatiment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBatiment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBatiment(entity1, entity2);
        const compareResult2 = service.compareBatiment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBatiment(entity1, entity2);
        const compareResult2 = service.compareBatiment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBatiment(entity1, entity2);
        const compareResult2 = service.compareBatiment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
