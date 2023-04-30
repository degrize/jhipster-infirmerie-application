import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConstante } from '../constante.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../constante.test-samples';

import { ConstanteService } from './constante.service';

const requireRestSample: IConstante = {
  ...sampleWithRequiredData,
};

describe('Constante Service', () => {
  let service: ConstanteService;
  let httpMock: HttpTestingController;
  let expectedResult: IConstante | IConstante[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConstanteService);
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

    it('should create a Constante', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const constante = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(constante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Constante', () => {
      const constante = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(constante).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Constante', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Constante', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Constante', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConstanteToCollectionIfMissing', () => {
      it('should add a Constante to an empty array', () => {
        const constante: IConstante = sampleWithRequiredData;
        expectedResult = service.addConstanteToCollectionIfMissing([], constante);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(constante);
      });

      it('should not add a Constante to an array that contains it', () => {
        const constante: IConstante = sampleWithRequiredData;
        const constanteCollection: IConstante[] = [
          {
            ...constante,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConstanteToCollectionIfMissing(constanteCollection, constante);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Constante to an array that doesn't contain it", () => {
        const constante: IConstante = sampleWithRequiredData;
        const constanteCollection: IConstante[] = [sampleWithPartialData];
        expectedResult = service.addConstanteToCollectionIfMissing(constanteCollection, constante);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(constante);
      });

      it('should add only unique Constante to an array', () => {
        const constanteArray: IConstante[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const constanteCollection: IConstante[] = [sampleWithRequiredData];
        expectedResult = service.addConstanteToCollectionIfMissing(constanteCollection, ...constanteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const constante: IConstante = sampleWithRequiredData;
        const constante2: IConstante = sampleWithPartialData;
        expectedResult = service.addConstanteToCollectionIfMissing([], constante, constante2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(constante);
        expect(expectedResult).toContain(constante2);
      });

      it('should accept null and undefined values', () => {
        const constante: IConstante = sampleWithRequiredData;
        expectedResult = service.addConstanteToCollectionIfMissing([], null, constante, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(constante);
      });

      it('should return initial array if no Constante is added', () => {
        const constanteCollection: IConstante[] = [sampleWithRequiredData];
        expectedResult = service.addConstanteToCollectionIfMissing(constanteCollection, undefined, null);
        expect(expectedResult).toEqual(constanteCollection);
      });
    });

    describe('compareConstante', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConstante(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConstante(entity1, entity2);
        const compareResult2 = service.compareConstante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConstante(entity1, entity2);
        const compareResult2 = service.compareConstante(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConstante(entity1, entity2);
        const compareResult2 = service.compareConstante(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
