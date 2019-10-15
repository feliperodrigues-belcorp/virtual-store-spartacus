import { Component, forwardRef, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ItemCounterComponent } from '@spartacus/storefront';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line */
  useExisting: forwardRef(() => BelcorpItemCounterComponent),
  multi: true
};

@Component({
  selector: 'app-belcorp-item-counter',
  templateUrl: './belcorp-item-counter.component.html',
  providers: [COUNTER_CONTROL_ACCESSOR],
})
export class BelcorpItemCounterComponent extends ItemCounterComponent {

  constructor(
    renderer: Renderer2
  ) {
    super(renderer)
  }



}
