import { Component, Input, Pipe, PipeTransform, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  CmsSearchBoxComponent,
  I18nTestingModule,
  ProductSearchService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { SearchBoxComponentService } from './search-box-component.service';
import { SearchBoxComponent } from './search-box.component';
import { SearchResults } from './search-box.model';

const mockSearchBoxComponentData: CmsSearchBoxComponent = {
  uid: '001',
  typeCode: 'SearchBoxComponent ',
  modifiedTime: new Date('2017-12-21T18:15:15+0000'),
  name: 'Mock SearchBox',
  displayProductImages: true,
  displayProducts: true,
  displaySuggestions: true,
  container: false,
  maxProducts: 5,
  maxSuggestions: 5,
  minCharactersBeforeRequest: 3,
  waitTimeBeforeRequest: 500,
};

class MockCmsComponentData {
  get data$(): Observable<CmsSearchBoxComponent> {
    return of();
  }
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {}
}

@Pipe({
  name: 'cxHighlight',
})
class MockHighlightPipe implements PipeTransform {
  transform(): any {}
}

@Component({
  selector: 'cx-icon',
  template: '',
})
export class MockCxIconComponent {
  @Input() type;
}

@Component({
  selector: 'cx-media',
  template: '<img>',
})
export class MockMediaComponent {
  @Input() container;
  @Input() format;
  @Input() alt;
}

describe('SearchBoxComponent', () => {
  let searchBoxComponent: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let serviceSpy: SearchBoxComponentService;
  let cmsComponentData: CmsComponentData<CmsSearchBoxComponent>;

  class SearchBoxComponentServiceSpy {
    launchSearchPage = jasmine.createSpy('launchSearchPage');
    getResults = jasmine.createSpy('search').and.callFake(() =>
      of(<SearchResults>{
        suggestions: ['te', 'test'],
        message: 'I found stuff for you!',
        products: [
          {
            name: 'title 1',
          },
        ],
      })
    );

    search() {}
    toggleBodyClass() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        I18nTestingModule,
      ],
      declarations: [
        SearchBoxComponent,
        MockUrlPipe,
        MockHighlightPipe,
        MockCxIconComponent,
        MockMediaComponent,
      ],
      providers: [
        {
          provide: ProductSearchService,
          useValue: {},
        },
        {
          provide: CmsComponentData,
          useClass: MockCmsComponentData,
        },
        {
          provide: SearchBoxComponentService,
          useClass: SearchBoxComponentServiceSpy,
        },
      ],
    }).compileComponents();
  }));

  describe('Default config', () => {
    beforeEach(() => {
      cmsComponentData = TestBed.get(CmsComponentData as Type<
        CmsComponentData<CmsSearchBoxComponent>
      >);

      spyOnProperty(cmsComponentData, 'data$').and.returnValue(
        of(mockSearchBoxComponentData)
      );

      fixture = TestBed.createComponent(SearchBoxComponent);
      searchBoxComponent = fixture.componentInstance;

      serviceSpy = fixture.debugElement.injector.get(
        SearchBoxComponentService
      ) as any;

      spyOn(searchBoxComponent, 'search').and.callThrough();
    });

    it('should be created', () => {
      expect(searchBoxComponent).toBeTruthy();
    });

    it('should dispatch new results when search is executed', () => {
      searchBoxComponent.search('testQuery');
      fixture.detectChanges();
      expect(serviceSpy.getResults).toHaveBeenCalled();
    });

    it('should dispatch new search query on input', () => {
      searchBoxComponent.queryText = 'test input';
      fixture.detectChanges();
      expect(searchBoxComponent.search).toHaveBeenCalledWith('test input');
    });

    it('should launch the search page', () => {
      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('keydown.enter', {});
      fixture.detectChanges();
      expect(serviceSpy.launchSearchPage).toHaveBeenCalled();
    });

    describe('UI tests', () => {
      it('should contain an input text field', () => {
        expect(fixture.debugElement.query(By.css('input'))).not.toBeNull();
      });

      it('should not contain search results panel', () => {
        expect(fixture.debugElement.query(By.css('.results'))).toBeFalsy();
      });

      it('should contain search results panel after search input', async(() => {
        searchBoxComponent.queryText = 'test input';
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.results'))).toBeTruthy();
      }));

      it('should contain 2 suggestion after search', () => {
        searchBoxComponent.queryText = 'te';
        fixture.detectChanges();

        expect(
          fixture.debugElement.queryAll(By.css('.suggestions a')).length
        ).toEqual(2);
      });

      it('should contain a message after search', () => {
        searchBoxComponent.queryText = 'te';
        fixture.detectChanges();

        const el = fixture.debugElement.query(By.css('.results .message'));
        expect(el).toBeTruthy();
        expect((<HTMLElement>el.nativeElement).innerText).toEqual(
          'I found stuff for you!'
        );
      });
    });

    it('should contain 1 product after search', () => {
      searchBoxComponent.queryText = 'te';
      fixture.detectChanges();

      expect(
        fixture.debugElement.queryAll(By.css('.products a')).length
      ).toEqual(1);
    });

    it('should contain product image in search result', () => {
      searchBoxComponent.queryText = 'te';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('.products a:first-child cx-media'))
      ).toBeTruthy();
    });

    it('should contain .has-media class', () => {
      searchBoxComponent.queryText = 'te';
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.products a:first-child.has-media'))
      ).toBeTruthy();
    });
  });

  describe('Searchbox config ', () => {
    describe('displayProductImages=false', () => {
      beforeEach(() => {
        cmsComponentData = TestBed.get(CmsComponentData as Type<
          CmsComponentData<CmsSearchBoxComponent>
        >);

        spyOnProperty(cmsComponentData, 'data$').and.returnValue(
          of({
            ...mockSearchBoxComponentData,
            displayProductImages: false,
          })
        );

        fixture = TestBed.createComponent(SearchBoxComponent);
        searchBoxComponent = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should have config', () => {
        expect(searchBoxComponent.config.displayProductImages).toBeFalsy();
      });

      it('should not contain product image', () => {
        expect(
          fixture.debugElement.query(By.css('.products a:first-child cx-media'))
        ).toBeNull();
      });

      it('should not contain .has-media class', () => {
        expect(
          fixture.debugElement.query(
            By.css('.products a:first-child.has-media')
          )
        ).toBeFalsy();
      });
    });

    describe('displaySuggestions=false', () => {
      beforeEach(() => {
        cmsComponentData = TestBed.get(CmsComponentData as Type<
          CmsComponentData<CmsSearchBoxComponent>
        >);

        spyOnProperty(cmsComponentData, 'data$').and.returnValue(
          of({
            ...mockSearchBoxComponentData,
            displaySuggestions: false,
          })
        );

        fixture = TestBed.createComponent(SearchBoxComponent);
        searchBoxComponent = fixture.componentInstance;

        fixture.detectChanges();
      });

      it('should have displaySuggestions=false in config', () => {
        expect(searchBoxComponent.config.displaySuggestions).toBeFalsy();
      });
    });
  });
});
