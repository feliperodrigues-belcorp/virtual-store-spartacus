import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CmsProductCarouselComponent as model,
  Product,
  ProductService,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CmsComponentData } from '../../../../cms-structure/page/model/cms-component-data';

@Component({
  selector: 'cx-product-carousel',
  templateUrl: './product-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCarouselComponent {
  private componentData$: Observable<model> = this.componentData.data$.pipe(
    filter(Boolean)
  );

  /**
   * returns an Obervable string for the title.
   */
  title$: Observable<string> = this.componentData$.pipe(
    map(data => data.title)
  );

  /**
   * Obervable that holds an Array of Observables. This is done, so that
   * the component UI could consider to lazy load the UI components when they're
   * in the viewpoint.
   */
  items$: Observable<Observable<Product>[]> = this.componentData$.pipe(
    map(data => data.productCodes.trim().split(' ')),
    map(codes => codes.map(code => this.productService.get(code)))
  );

  constructor(
    protected componentData: CmsComponentData<model>,
    protected productService: ProductService
  ) {}
}
