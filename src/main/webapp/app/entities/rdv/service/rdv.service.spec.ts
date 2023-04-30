import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IRdv } from '../rdv.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../rdv.test-samples';

import { RdvService, RestRdv } from './rdv.service';

const requireRestSample: RestRdv = {
  ...sampleWithRequiredData,
  dateRdv: sampleWithRequiredData.dateRdv?.format(DATE_FORMAT),
};

describe('Rdv Service', () => {
  let service: RdvService;
  let httpMock: HttpTestingController;
  let expectedResult: IRdv | IRdv[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RdvService);
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

    it('should create a Rdv', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const rdv = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(rdv).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Rdv', () => {
      const rdv = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(rdv).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Rdv', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Rdv', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Rdv', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRdvToCollectionIfMissing', () => {
      it('should add a Rdv to an empty array', () => {
        const rdv: IRdv = sampleWithRequiredData;
        expectedResult = service.addRdvToCollectionIfMissing([], rdv);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rdv);
      });

      it('should not add a Rdv to an array that contains it', () => {
        const rdv: IRdv = sampleWithRequiredData;
        const rdvCollection: IRdv[] = [
          {
            ...rdv,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRdvToCollectionIfMissing(rdvCollection, rdv);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Rdv to an array that doesn't contain it", () => {
        const rdv: IRdv = sampleWithRequiredData;
        const rdvCollection: IRdv[] = [sampleWithPartialData];
        expectedResult = service.addRdvToCollectionIfMissing(rdvCollection, rdv);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rdv);
      });

      it('should add only unique Rdv to an array', () => {
        const rdvArray: IRdv[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const rdvCollection: IRdv[] = [sampleWithRequiredData];
        expectedResult = service.addRdvToCollectionIfMissing(rdvCollection, ...rdvArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const rdv: IRdv = sampleWithRequiredData;
        const rdv2: IRdv = sampleWithPartialData;
        expectedResult = service.addRdvToCollectionIfMissing([], rdv, rdv2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(rdv);
        expect(expectedResult).toContain(rdv2);
      });

      it('should accept null and undefined values', () => {
        const rdv: IRdv = sampleWithRequiredData;
        expectedResult = service.addRdvToCollectionIfMissing([], null, rdv, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(rdv);
      });

      it('should return initial array if no Rdv is added', () => {
        const rdvCollection: IRdv[] = [sampleWithRequiredData];
        expectedResult = service.addRdvToCollectionIfMissing(rdvCollection, undefined, null);
        expect(expectedResult).toEqual(rdvCollection);
      });
    });

    describe('compareRdv', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRdv(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRdv(entity1, entity2);
        const compareResult2 = service.compareRdv(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRdv(entity1, entity2);
        const compareResult2 = service.compareRdv(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRdv(entity1, entity2);
        const compareResult2 = service.compareRdv(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
