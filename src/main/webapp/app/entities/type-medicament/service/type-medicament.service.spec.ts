import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeMedicament } from '../type-medicament.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type-medicament.test-samples';

import { TypeMedicamentService } from './type-medicament.service';

const requireRestSample: ITypeMedicament = {
  ...sampleWithRequiredData,
};

describe('TypeMedicament Service', () => {
  let service: TypeMedicamentService;
  let httpMock: HttpTestingController;
  let expectedResult: ITypeMedicament | ITypeMedicament[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeMedicamentService);
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

    it('should create a TypeMedicament', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const typeMedicament = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(typeMedicament).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeMedicament', () => {
      const typeMedicament = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(typeMedicament).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeMedicament', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeMedicament', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TypeMedicament', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypeMedicamentToCollectionIfMissing', () => {
      it('should add a TypeMedicament to an empty array', () => {
        const typeMedicament: ITypeMedicament = sampleWithRequiredData;
        expectedResult = service.addTypeMedicamentToCollectionIfMissing([], typeMedicament);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeMedicament);
      });

      it('should not add a TypeMedicament to an array that contains it', () => {
        const typeMedicament: ITypeMedicament = sampleWithRequiredData;
        const typeMedicamentCollection: ITypeMedicament[] = [
          {
            ...typeMedicament,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypeMedicamentToCollectionIfMissing(typeMedicamentCollection, typeMedicament);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeMedicament to an array that doesn't contain it", () => {
        const typeMedicament: ITypeMedicament = sampleWithRequiredData;
        const typeMedicamentCollection: ITypeMedicament[] = [sampleWithPartialData];
        expectedResult = service.addTypeMedicamentToCollectionIfMissing(typeMedicamentCollection, typeMedicament);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeMedicament);
      });

      it('should add only unique TypeMedicament to an array', () => {
        const typeMedicamentArray: ITypeMedicament[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typeMedicamentCollection: ITypeMedicament[] = [sampleWithRequiredData];
        expectedResult = service.addTypeMedicamentToCollectionIfMissing(typeMedicamentCollection, ...typeMedicamentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeMedicament: ITypeMedicament = sampleWithRequiredData;
        const typeMedicament2: ITypeMedicament = sampleWithPartialData;
        expectedResult = service.addTypeMedicamentToCollectionIfMissing([], typeMedicament, typeMedicament2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeMedicament);
        expect(expectedResult).toContain(typeMedicament2);
      });

      it('should accept null and undefined values', () => {
        const typeMedicament: ITypeMedicament = sampleWithRequiredData;
        expectedResult = service.addTypeMedicamentToCollectionIfMissing([], null, typeMedicament, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeMedicament);
      });

      it('should return initial array if no TypeMedicament is added', () => {
        const typeMedicamentCollection: ITypeMedicament[] = [sampleWithRequiredData];
        expectedResult = service.addTypeMedicamentToCollectionIfMissing(typeMedicamentCollection, undefined, null);
        expect(expectedResult).toEqual(typeMedicamentCollection);
      });
    });

    describe('compareTypeMedicament', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTypeMedicament(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTypeMedicament(entity1, entity2);
        const compareResult2 = service.compareTypeMedicament(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTypeMedicament(entity1, entity2);
        const compareResult2 = service.compareTypeMedicament(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTypeMedicament(entity1, entity2);
        const compareResult2 = service.compareTypeMedicament(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
