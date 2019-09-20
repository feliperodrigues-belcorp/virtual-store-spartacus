import { TestBed, inject } from '@angular/core/testing';
import { ProductReferenceNormalizer } from './product-reference-normalizer';

describe('ProductReferenceConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductReferenceNormalizer],
    });
  });

  it('should inject ProductReferenceConverterService', inject(
    [ProductReferenceNormalizer],
    (productReferenceConverterService: ProductReferenceNormalizer) => {
      expect(productReferenceConverterService).toBeTruthy();
    }
  ));

  it('should convert product reference', () => {
    // no idea what is the reference data
  });
});
