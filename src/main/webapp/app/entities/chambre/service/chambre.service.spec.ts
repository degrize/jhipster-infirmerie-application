import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChambre } from '../chambre.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../chambre.test-samples';

import { ChambreService } from './chambre.service';

const requireRestSample: IChambre = {
  ...sampleWithRequiredData,
};

describe('Chambre Service', () => {
  let service: ChambreService;
  let httpMock: HttpTestingController;
  let expectedResult: IChambre | IChambre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChambreService);
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

    it('should create a Chambre', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chambre = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(chambre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chambre', () => {
      const chambre = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(chambre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chambre', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chambre', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Chambre', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addChambreToCollectionIfMissing', () => {
      it('should add a Chambre to an empty array', () => {
        const chambre: IChambre = sampleWithRequiredData;
        expectedResult = service.addChambreToCollectionIfMissing([], chambre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chambre);
      });

      it('should not add a Chambre to an array that contains it', () => {
        const chambre: IChambre = sampleWithRequiredData;
        const chambreCollection: IChambre[] = [
          {
            ...chambre,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChambreToCollectionIfMissing(chambreCollection, chambre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chambre to an array that doesn't contain it", () => {
        const chambre: IChambre = sampleWithRequiredData;
        const chambreCollection: IChambre[] = [sampleWithPartialData];
        expectedResult = service.addChambreToCollectionIfMissing(chambreCollection, chambre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chambre);
      });

      it('should add only unique Chambre to an array', () => {
        const chambreArray: IChambre[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const chambreCollection: IChambre[] = [sampleWithRequiredData];
        expectedResult = service.addChambreToCollectionIfMissing(chambreCollection, ...chambreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chambre: IChambre = sampleWithRequiredData;
        const chambre2: IChambre = sampleWithPartialData;
        expectedResult = service.addChambreToCollectionIfMissing([], chambre, chambre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chambre);
        expect(expectedResult).toContain(chambre2);
      });

      it('should accept null and undefined values', () => {
        const chambre: IChambre = sampleWithRequiredData;
        expectedResult = service.addChambreToCollectionIfMissing([], null, chambre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chambre);
      });

      it('should return initial array if no Chambre is added', () => {
        const chambreCollection: IChambre[] = [sampleWithRequiredData];
        expectedResult = service.addChambreToCollectionIfMissing(chambreCollection, undefined, null);
        expect(expectedResult).toEqual(chambreCollection);
      });
    });

    describe('compareChambre', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChambre(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChambre(entity1, entity2);
        const compareResult2 = service.compareChambre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChambre(entity1, entity2);
        const compareResult2 = service.compareChambre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChambre(entity1, entity2);
        const compareResult2 = service.compareChambre(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
