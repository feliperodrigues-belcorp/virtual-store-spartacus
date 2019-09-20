import {
  Component,
  Inject,
  NgModule,
  PLATFORM_ID,
  Renderer2,
  Type,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  CmsComponent,
  CmsConfig,
  CmsService,
  ContentSlotComponentData,
  DynamicAttributeService,
} from '@spartacus/core';
import { CmsComponentData } from '../model/cms-component-data';
import { ComponentWrapperDirective } from './component-wrapper.directive';
import { CxApiService } from './cx-api.service';

const testText = 'test text';

@Component({
  selector: 'cx-test',
  template: `
    <div id="debugEl1">${testText}</div>
  `,
})
export class TestComponent {
  constructor(
    public cmsData: CmsComponentData<CmsComponent>,
    @Inject('testService') public testService
  ) {}
}

@NgModule({
  declarations: [TestComponent],
  entryComponents: [TestComponent],
  exports: [TestComponent],
})
export class TestModule {}

const MockCmsModuleConfig: CmsConfig = {
  cmsComponents: {
    CMSTestComponent: {
      component: TestComponent,
      providers: [
        {
          provide: 'testService',
          useValue: 'testValue',
        },
      ],
    },
  },
};

class MockCmsService {
  getComponentData(): any {}
  isLaunchInSmartEdit(): boolean {
    return true;
  }
}

class MockDynamicAttributeService {
  addDynamicAttributes() {}
}

@Component({
  template:
    '<ng-container [cxComponentWrapper]="component">' + '</ng-container>',
})
class TestWrapperComponent {
  component: ContentSlotComponentData = {
    typeCode: 'cms_typeCode',
    flexType: 'CMSTestComponent',
    uid: 'test_uid',
    properties: {
      smartedit: {
        test: 'test',
      },
    },
  };
}

describe('ComponentWrapperDirective', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let cmsService: CmsService;
  let dynamicAttributeService: DynamicAttributeService;
  let renderer: Renderer2;

  let testBedConfig: TestModuleMetadata;

  beforeEach(() => {
    testBedConfig = {
      imports: [TestModule],
      declarations: [TestWrapperComponent, ComponentWrapperDirective],
      providers: [
        Renderer2,
        { provide: CmsConfig, useValue: MockCmsModuleConfig },
        { provide: CmsService, useClass: MockCmsService },
        {
          provide: DynamicAttributeService,
          useClass: MockDynamicAttributeService,
        },
        { provide: CxApiService, useValue: { cms: {}, auth: {}, routing: {} } },
      ],
    };
  });

  describe('in SSR', () => {
    let cmsConfig: CmsConfig;

    beforeEach(async(() => {
      testBedConfig.providers.push({
        provide: PLATFORM_ID,
        useValue: 'server',
      });
      TestBed.configureTestingModule(testBedConfig).compileComponents();
    }));

    describe('with angular component', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(TestWrapperComponent as Type<
          TestWrapperComponent
        >);
        cmsService = TestBed.get(CmsService as Type<CmsService>);
        cmsConfig = TestBed.get(CmsConfig as Type<CmsConfig>);
      });

      it('should instantiate the found component if it was enabled for SSR', () => {
        cmsConfig.cmsComponents.CMSTestComponent.disableSSR = false;
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#debugEl1').textContent).toContain(
          testText
        );
      });

      it('should NOT instantiate the found component if it was disabled for SSR', () => {
        cmsConfig.cmsComponents.CMSTestComponent.disableSSR = true;
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#debugEl1')).toBe(null);
      });
    });
  });

  describe('in non-SSR', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule(testBedConfig).compileComponents();
    }));

    describe('with angular component', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(TestWrapperComponent);
        cmsService = TestBed.get(CmsService as Type<CmsService>);
        dynamicAttributeService = TestBed.get(DynamicAttributeService as Type<
          DynamicAttributeService
        >);
        renderer = fixture.componentRef.injector.get<Renderer2>(
          Renderer2 as any
        );
      });

      it('should instantiate the found component correctly', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('#debugEl1').textContent).toContain(
          testText
        );
      });

      it('should add smartedit contract if app launch in smart edit', () => {
        spyOn(
          dynamicAttributeService,
          'addDynamicAttributes'
        ).and.callThrough();

        fixture.detectChanges();
        const el = fixture.debugElement;
        const compEl = el.query(By.css('cx-test')).nativeElement;
        expect(
          dynamicAttributeService.addDynamicAttributes
        ).toHaveBeenCalledWith(
          {
            smartedit: {
              test: 'test',
            },
          },
          compEl,
          renderer
        );
      });

      it('should not add smartedit contract if app launch in smart edit', () => {
        spyOn(
          dynamicAttributeService,
          'addDynamicAttributes'
        ).and.callThrough();
        spyOn(cmsService, 'isLaunchInSmartEdit').and.returnValue(false);

        fixture = TestBed.createComponent(TestWrapperComponent);
        fixture.detectChanges();
        const el = fixture.debugElement;
        const compEl = el.query(By.css('cx-test')).nativeElement;
        expect(
          dynamicAttributeService.addDynamicAttributes
        ).not.toHaveBeenCalledWith(
          {
            smartedit: {
              test: 'test',
            },
          },
          compEl,
          renderer
        );
      });

      it('should inject cms component data', () => {
        fixture.detectChanges();
        const testCromponemtInstance = <TestComponent>(
          fixture.debugElement.children[0].componentInstance
        );
        expect(testCromponemtInstance.cmsData.uid).toContain('test_uid');
      });

      it('should provide configurable cms component providers', () => {
        fixture.detectChanges();
        const testCromponemtInstance = <TestComponent>(
          fixture.debugElement.children[0].componentInstance
        );
        expect(testCromponemtInstance.testService).toEqual('testValue');
      });
    });

    describe('with web component', () => {
      let scriptEl;

      beforeEach(() => {
        const cmsMapping = TestBed.get(CmsConfig as Type<CmsConfig>);
        cmsMapping.cmsComponents.CMSTestComponent.component =
          'path/to/file.js#cms-component';
        fixture = TestBed.createComponent(TestWrapperComponent);
        fixture.detectChanges();
        scriptEl = fixture.debugElement.nativeNode.nextSibling;
      });

      it('should load web component script', () => {
        expect(scriptEl.src).toContain('path/to/file.js');
      });

      it('should instantiate web component', done => {
        scriptEl.onload(); // invoke load callbacks

        // run in next runloop (to process async tasks)
        setTimeout(() => {
          const cmsComponentElement = fixture.debugElement.nativeElement.querySelector(
            'cms-component'
          );
          expect(cmsComponentElement).toBeTruthy();
          const componentData = cmsComponentElement.cxApi.CmsComponentData;
          expect(componentData.uid).toEqual('test_uid');
          done();
        });
      });

      it('should pass cxApi to web component', done => {
        scriptEl.onload(); // invoke load callbacks

        // run in next runloop (to process async tasks)
        setTimeout(() => {
          const cmsComponentElement = fixture.debugElement.nativeElement.querySelector(
            'cms-component'
          );
          const cxApi = cmsComponentElement.cxApi as CxApiService;
          expect(cxApi.cms).toBeTruthy();
          expect(cxApi.auth).toBeTruthy();
          expect(cxApi.routing).toBeTruthy();
          expect(cxApi.cmsComponentData).toBeTruthy();
          done();
        });
      });
    });
  });
});
