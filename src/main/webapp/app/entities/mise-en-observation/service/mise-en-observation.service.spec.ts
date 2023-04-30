import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMiseEnObservation } from '../mise-en-observation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mise-en-observation.test-samples';

import { MiseEnObservationService, RestMiseEnObservation } from './mise-en-observation.service';

const requireRestSample: RestMiseEnObservation = {
  ...sampleWithRequiredData,
  dateDebut: sampleWithRequiredData.dateDebut?.format(DATE_FORMAT),
  dateFin: sampleWithRequiredData.dateFin?.format(DATE_FORMAT),
};

describe('MiseEnObservation Service', () => {
  let service: MiseEnObservationService;
  let httpMock: HttpTestingController;
  let expectedResult: IMiseEnObservation | IMiseEnObservation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MiseEnObservationService);
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

    it('should create a MiseEnObservation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const miseEnObservation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(miseEnObservation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MiseEnObservation', () => {
      const miseEnObservation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(miseEnObservation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MiseEnObservation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MiseEnObservation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MiseEnObservation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMiseEnObservationToCollectionIfMissing', () => {
      it('should add a MiseEnObservation to an empty array', () => {
        const miseEnObservation: IMiseEnObservation = sampleWithRequiredData;
        expectedResult = service.addMiseEnObservationToCollectionIfMissing([], miseEnObservation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miseEnObservation);
      });

      it('should not add a MiseEnObservation to an array that contains it', () => {
        const miseEnObservation: IMiseEnObservation = sampleWithRequiredData;
        const miseEnObservationCollection: IMiseEnObservation[] = [
          {
            ...miseEnObservation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMiseEnObservationToCollectionIfMissing(miseEnObservationCollection, miseEnObservation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MiseEnObservation to an array that doesn't contain it", () => {
        const miseEnObservation: IMiseEnObservation = sampleWithRequiredData;
        const miseEnObservationCollection: IMiseEnObservation[] = [sampleWithPartialData];
        expectedResult = service.addMiseEnObservationToCollectionIfMissing(miseEnObservationCollection, miseEnObservation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miseEnObservation);
      });

      it('should add only unique MiseEnObservation to an array', () => {
        const miseEnObservationArray: IMiseEnObservation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const miseEnObservationCollection: IMiseEnObservation[] = [sampleWithRequiredData];
        expectedResult = service.addMiseEnObservationToCollectionIfMissing(miseEnObservationCollection, ...miseEnObservationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const miseEnObservation: IMiseEnObservation = sampleWithRequiredData;
        const miseEnObservation2: IMiseEnObservation = sampleWithPartialData;
        expectedResult = service.addMiseEnObservationToCollectionIfMissing([], miseEnObservation, miseEnObservation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miseEnObservation);
        expect(expectedResult).toContain(miseEnObservation2);
      });

      it('should accept null and undefined values', () => {
        const miseEnObservation: IMiseEnObservation = sampleWithRequiredData;
        expectedResult = service.addMiseEnObservationToCollectionIfMissing([], null, miseEnObservation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miseEnObservation);
      });

      it('should return initial array if no MiseEnObservation is added', () => {
        const miseEnObservationCollection: IMiseEnObservation[] = [sampleWithRequiredData];
        expectedResult = service.addMiseEnObservationToCollectionIfMissing(miseEnObservationCollection, undefined, null);
        expect(expectedResult).toEqual(miseEnObservationCollection);
      });
    });

    describe('compareMiseEnObservation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMiseEnObservation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMiseEnObservation(entity1, entity2);
        const compareResult2 = service.compareMiseEnObservation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMiseEnObservation(entity1, entity2);
        const compareResult2 = service.compareMiseEnObservation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMiseEnObservation(entity1, entity2);
        const compareResult2 = service.compareMiseEnObservation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
