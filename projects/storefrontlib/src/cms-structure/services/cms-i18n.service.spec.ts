import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslationChunkService, TranslationService } from '@spartacus/core';
import { CmsI18nService } from './cms-i18n.service';
import { CmsMappingService } from './cms-mapping.service';

import createSpy = jasmine.createSpy;

describe('CmsI18nService', () => {
  let service: CmsI18nService;
  let translation: TranslationService;

  const mockCmsMapping = {
    getI18nKeysForComponents: () => ['key1', 'key2'],
  };
  const mockTranslation = {
    loadChunks: createSpy('loadChunks'),
  };
  const mockTranslationChunk = {
    getChunkNameForKey: createSpy('getChunkNameForKey').and.callFake(
      key => `chunkFor-${key}`
    ),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CmsI18nService,
        { provide: CmsMappingService, useValue: mockCmsMapping },
        { provide: TranslationService, useValue: mockTranslation },
        {
          provide: TranslationChunkService,
          useValue: mockTranslationChunk,
        },
      ],
    });
    service = TestBed.get(CmsI18nService as Type<CmsI18nService>);
    translation = TestBed.get(TranslationService as Type<TranslationService>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadChunksForComponents', () => {
    it('should load i18n chunks for given component types', () => {
      service.loadChunksForComponents([]);

      expect(translation.loadChunks).toHaveBeenCalledWith([
        'chunkFor-key1',
        'chunkFor-key2',
      ]);
    });
  });
});
