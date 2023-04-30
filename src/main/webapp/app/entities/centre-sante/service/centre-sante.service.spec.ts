import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICentreSante } from '../centre-sante.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../centre-sante.test-samples';

import { CentreSanteService } from './centre-sante.service';

const requireRestSample: ICentreSante = {
  ...sampleWithRequiredData,
};

describe('CentreSante Service', () => {
  let service: CentreSanteService;
  let httpMock: HttpTestingController;
  let expectedResult: ICentreSante | ICentreSante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CentreSanteService);
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

    it('should create a CentreSante', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const centreSante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(centreSante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CentreSante', () => {
      const centreSante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(centreSante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CentreSante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CentreSante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CentreSante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCentreSanteToCollectionIfMissing', () => {
      it('should add a CentreSante to an empty array', () => {
        const centreSante: ICentreSante = sampleWithRequiredData;
        expectedResult = service.addCentreSanteToCollectionIfMissing([], centreSante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(centreSante);
      });

      it('should not add a CentreSante to an array that contains it', () => {
        const centreSante: ICentreSante = sampleWithRequiredData;
        const centreSanteCollection: ICentreSante[] = [
          {
            ...centreSante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCentreSanteToCollectionIfMissing(centreSanteCollection, centreSante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CentreSante to an array that doesn't contain it", () => {
        const centreSante: ICentreSante = sampleWithRequiredData;
        const centreSanteCollection: ICentreSante[] = [sampleWithPartialData];
        expectedResult = service.addCentreSanteToCollectionIfMissing(centreSanteCollection, centreSante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(centreSante);
      });

      it('should add only unique CentreSante to an array', () => {
        const centreSanteArray: ICentreSante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const centreSanteCollection: ICentreSante[] = [sampleWithRequiredData];
        expectedResult = service.addCentreSanteToCollectionIfMissing(centreSanteCollection, ...centreSanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const centreSante: ICentreSante = sampleWithRequiredData;
        const centreSante2: ICentreSante = sampleWithPartialData;
        expectedResult = service.addCentreSanteToCollectionIfMissing([], centreSante, centreSante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(centreSante);
        expect(expectedResult).toContain(centreSante2);
      });

      it('should accept null and undefined values', () => {
        const centreSante: ICentreSante = sampleWithRequiredData;
        expectedResult = service.addCentreSanteToCollectionIfMissing([], null, centreSante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(centreSante);
      });

      it('should return initial array if no CentreSante is added', () => {
        const centreSanteCollection: ICentreSante[] = [sampleWithRequiredData];
        expectedResult = service.addCentreSanteToCollectionIfMissing(centreSanteCollection, undefined, null);
        expect(expectedResult).toEqual(centreSanteCollection);
      });
    });

    describe('compareCentreSante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCentreSante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCentreSante(entity1, entity2);
        const compareResult2 = service.compareCentreSante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCentreSante(entity1, entity2);
        const compareResult2 = service.compareCentreSante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCentreSante(entity1, entity2);
        const compareResult2 = service.compareCentreSante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
