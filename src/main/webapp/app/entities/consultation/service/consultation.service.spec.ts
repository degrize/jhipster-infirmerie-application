import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IConsultation } from '../consultation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../consultation.test-samples';

import { ConsultationService, RestConsultation } from './consultation.service';

const requireRestSample: RestConsultation = {
  ...sampleWithRequiredData,
  dateConsultation: sampleWithRequiredData.dateConsultation?.format(DATE_FORMAT),
};

describe('Consultation Service', () => {
  let service: ConsultationService;
  let httpMock: HttpTestingController;
  let expectedResult: IConsultation | IConsultation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConsultationService);
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

    it('should create a Consultation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const consultation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(consultation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Consultation', () => {
      const consultation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(consultation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Consultation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Consultation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Consultation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConsultationToCollectionIfMissing', () => {
      it('should add a Consultation to an empty array', () => {
        const consultation: IConsultation = sampleWithRequiredData;
        expectedResult = service.addConsultationToCollectionIfMissing([], consultation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consultation);
      });

      it('should not add a Consultation to an array that contains it', () => {
        const consultation: IConsultation = sampleWithRequiredData;
        const consultationCollection: IConsultation[] = [
          {
            ...consultation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, consultation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Consultation to an array that doesn't contain it", () => {
        const consultation: IConsultation = sampleWithRequiredData;
        const consultationCollection: IConsultation[] = [sampleWithPartialData];
        expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, consultation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consultation);
      });

      it('should add only unique Consultation to an array', () => {
        const consultationArray: IConsultation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const consultationCollection: IConsultation[] = [sampleWithRequiredData];
        expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, ...consultationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const consultation: IConsultation = sampleWithRequiredData;
        const consultation2: IConsultation = sampleWithPartialData;
        expectedResult = service.addConsultationToCollectionIfMissing([], consultation, consultation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consultation);
        expect(expectedResult).toContain(consultation2);
      });

      it('should accept null and undefined values', () => {
        const consultation: IConsultation = sampleWithRequiredData;
        expectedResult = service.addConsultationToCollectionIfMissing([], null, consultation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consultation);
      });

      it('should return initial array if no Consultation is added', () => {
        const consultationCollection: IConsultation[] = [sampleWithRequiredData];
        expectedResult = service.addConsultationToCollectionIfMissing(consultationCollection, undefined, null);
        expect(expectedResult).toEqual(consultationCollection);
      });
    });

    describe('compareConsultation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConsultation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConsultation(entity1, entity2);
        const compareResult2 = service.compareConsultation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConsultation(entity1, entity2);
        const compareResult2 = service.compareConsultation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConsultation(entity1, entity2);
        const compareResult2 = service.compareConsultation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
