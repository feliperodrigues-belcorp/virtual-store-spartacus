import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '../config/config.module';
import { CmsConfig } from './config/cms-config';
import { CmsStructureConfig } from './config/cms-structure.config';
import { defaultCmsModuleConfig } from './config/default-cms-config';
import { CmsService } from './facade/cms.service';
import { CmsPageTitleModule } from './page/page.module';
import { CmsStoreModule } from './store/cms-store.module';

@NgModule({
  imports: [CmsStoreModule, CmsPageTitleModule],
})
export class CmsModule {
  static forRoot(): ModuleWithProviders<CmsModule> {
    return {
      ngModule: CmsModule,
      providers: [
        CmsService,
        { provide: CmsConfig, useExisting: Config },
        { provide: CmsStructureConfig, useExisting: Config },
        provideConfig(defaultCmsModuleConfig),
      ],
    };
  }
}
