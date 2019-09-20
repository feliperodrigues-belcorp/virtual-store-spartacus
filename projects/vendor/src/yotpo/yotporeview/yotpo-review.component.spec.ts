import { Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { YotpoConfig } from '../yotpoconfig/yotpo-config';
import { YotpoService } from './../service/yotpo.service';
import { YotporeviewComponent } from './yotpo-review.component';

const productCode = '123456';
const mockProduct: Product = { code: productCode };

class MockYotpoService {
  getProduct(): Observable<Product> {
    return of(mockProduct);
  }
  addYotpoInitWidgetsScript() {}
}

class MockYotpoConfig extends YotpoConfig {
  vendor = {
    yotpo: {
      appToken: 'abc',
    },
  };
}

describe('YotporeviewComponent', () => {
  let component: YotporeviewComponent;
  let fixture: ComponentFixture<YotporeviewComponent>;
  let service: YotpoService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: YotpoConfig, useClass: MockYotpoConfig },
        {
          provide: YotpoService,
          useClass: MockYotpoService,
        },
      ],
      declarations: [YotporeviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YotporeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(YotpoService as Type<YotpoService>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product data', () => {
    let result: Product;
    component.ngOnInit();
    component.product$.subscribe(product => (result = product));
    expect(result).toEqual(mockProduct);
  });

  it('should add Yotpo init widgets script after view init', () => {
    spyOn(service, 'addYotpoInitWidgetsScript');
    component.ngAfterViewInit();
    expect(service.addYotpoInitWidgetsScript).toHaveBeenCalled();
  });
});
