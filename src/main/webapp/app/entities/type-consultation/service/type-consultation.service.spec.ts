import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeConsultation } from '../type-consultation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../type-consultation.test-samples';

import { TypeConsultationService } from './type-consultation.service';

const requireRestSample: ITypeConsultation = {
  ...sampleWithRequiredData,
};

describe('TypeConsultation Service', () => {
  let service: TypeConsultationService;
  let httpMock: HttpTestingController;
  let expectedResult: ITypeConsultation | ITypeConsultation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeConsultationService);
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

    it('should create a TypeConsultation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const typeConsultation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(typeConsultation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeConsultation', () => {
      const typeConsultation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(typeConsultation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeConsultation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeConsultation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TypeConsultation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTypeConsultationToCollectionIfMissing', () => {
      it('should add a TypeConsultation to an empty array', () => {
        const typeConsultation: ITypeConsultation = sampleWithRequiredData;
        expectedResult = service.addTypeConsultationToCollectionIfMissing([], typeConsultation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeConsultation);
      });

      it('should not add a TypeConsultation to an array that contains it', () => {
        const typeConsultation: ITypeConsultation = sampleWithRequiredData;
        const typeConsultationCollection: ITypeConsultation[] = [
          {
            ...typeConsultation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTypeConsultationToCollectionIfMissing(typeConsultationCollection, typeConsultation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeConsultation to an array that doesn't contain it", () => {
        const typeConsultation: ITypeConsultation = sampleWithRequiredData;
        const typeConsultationCollection: ITypeConsultation[] = [sampleWithPartialData];
        expectedResult = service.addTypeConsultationToCollectionIfMissing(typeConsultationCollection, typeConsultation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeConsultation);
      });

      it('should add only unique TypeConsultation to an array', () => {
        const typeConsultationArray: ITypeConsultation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const typeConsultationCollection: ITypeConsultation[] = [sampleWithRequiredData];
        expectedResult = service.addTypeConsultationToCollectionIfMissing(typeConsultationCollection, ...typeConsultationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeConsultation: ITypeConsultation = sampleWithRequiredData;
        const typeConsultation2: ITypeConsultation = sampleWithPartialData;
        expectedResult = service.addTypeConsultationToCollectionIfMissing([], typeConsultation, typeConsultation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeConsultation);
        expect(expectedResult).toContain(typeConsultation2);
      });

      it('should accept null and undefined values', () => {
        const typeConsultation: ITypeConsultation = sampleWithRequiredData;
        expectedResult = service.addTypeConsultationToCollectionIfMissing([], null, typeConsultation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeConsultation);
      });

      it('should return initial array if no TypeConsultation is added', () => {
        const typeConsultationCollection: ITypeConsultation[] = [sampleWithRequiredData];
        expectedResult = service.addTypeConsultationToCollectionIfMissing(typeConsultationCollection, undefined, null);
        expect(expectedResult).toEqual(typeConsultationCollection);
      });
    });

    describe('compareTypeConsultation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTypeConsultation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTypeConsultation(entity1, entity2);
        const compareResult2 = service.compareTypeConsultation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTypeConsultation(entity1, entity2);
        const compareResult2 = service.compareTypeConsultation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTypeConsultation(entity1, entity2);
        const compareResult2 = service.compareTypeConsultation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
