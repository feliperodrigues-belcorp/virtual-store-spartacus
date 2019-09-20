import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConverterService } from '@spartacus/core';
import { Occ } from '../../../occ-models/occ.models';
import { OccProductSearchPageNormalizer } from './occ-product-search-page-normalizer';
import createSpy = jasmine.createSpy;

class MockConverterService {
  convert = createSpy('ConverterService.convert').and.returnValue({
    images: ['images'],
  });
}

const mockSource: Occ.ProductSearchPage = {
  products: [{ images: [] }, { images: [] }],
};

describe('OccProductSearchPageNormalizer', () => {
  let normalizer: OccProductSearchPageNormalizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConverterService,
          useClass: MockConverterService,
        },
        OccProductSearchPageNormalizer,
      ],
    });

    normalizer = TestBed.get(OccProductSearchPageNormalizer as Type<
      OccProductSearchPageNormalizer
    >);
  });

  it('should inject ProductImageConverterService', () => {
    expect(normalizer).toBeTruthy();
  });

  it('should apply product image normalizer to products', () => {
    const converter = TestBed.get(ConverterService as Type<ConverterService>);
    const result = normalizer.convert(mockSource);
    const expected = {
      products: [{ images: ['images' as any] }, { images: ['images' as any] }],
    } as any;
    expect(result).toEqual(expected);
    expect(converter.convert).toHaveBeenCalled();
  });
});
