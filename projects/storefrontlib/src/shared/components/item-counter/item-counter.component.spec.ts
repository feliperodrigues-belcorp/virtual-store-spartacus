import { Type } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemCounterComponent } from './item-counter.component';

class MockEvent {
  code: string;

  preventDefault() {}

  stopPropagation() {}
}

const testData = [
  { incomingValue: 0, adjustedValue: 1, isMaxOrMinValueOrBeyond: true },
  { incomingValue: 1, adjustedValue: 1, isMaxOrMinValueOrBeyond: true },
  { incomingValue: 2, adjustedValue: 2, isMaxOrMinValueOrBeyond: false },
  { incomingValue: 4, adjustedValue: 4, isMaxOrMinValueOrBeyond: false },
  { incomingValue: 5, adjustedValue: 5, isMaxOrMinValueOrBeyond: true },
  { incomingValue: 6, adjustedValue: 5, isMaxOrMinValueOrBeyond: true },
];

describe('ItemCounterComponent', () => {
  let itemCounterComponent: ItemCounterComponent;
  let fixture: ComponentFixture<ItemCounterComponent>;

  let keyBoardEvent: MockEvent;
  let focusEvent: FocusEvent;

  let isInputFocused;
  let isIncrementBtnFocused;
  let isDecrementBtnFocused;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [ItemCounterComponent],
      providers: [
        { provide: Function },
        { provide: KeyboardEvent, useClass: MockEvent },
        { provide: FocusEvent, useClass: MockEvent },
        { provide: MockEvent },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    isInputFocused = false;
    isIncrementBtnFocused = false;
    isDecrementBtnFocused = false;
    fixture = TestBed.createComponent(ItemCounterComponent);
    itemCounterComponent = fixture.componentInstance;
    itemCounterComponent.input = {
      nativeElement: {
        focus: () => {
          isInputFocused = true;
        },
      },
    };
    itemCounterComponent.incrementBtn = {
      nativeElement: {
        focus: () => {
          isIncrementBtnFocused = true;
        },
      },
    };
    itemCounterComponent.decrementBtn = {
      nativeElement: {
        focus: () => {
          isDecrementBtnFocused = true;
        },
      },
    };

    keyBoardEvent = TestBed.get(KeyboardEvent as Type<KeyboardEvent>);
    focusEvent = TestBed.get(FocusEvent as Type<FocusEvent>);

    spyOn(itemCounterComponent, 'decrement').and.callThrough();
    spyOn(itemCounterComponent, 'increment').and.callThrough();
    spyOn(itemCounterComponent, 'updateValue').and.callThrough();
    spyOn(itemCounterComponent, 'isMaxOrMinValueOrBeyond').and.callThrough();
    spyOn(itemCounterComponent, 'adjustValueInRange').and.callThrough();
    spyOn(itemCounterComponent, 'manualChange').and.callThrough();
    spyOn(itemCounterComponent.update, 'emit').and.callThrough();
    spyOn(keyBoardEvent, 'preventDefault').and.callThrough();
    spyOn(keyBoardEvent, 'stopPropagation').and.callThrough();
    spyOn(focusEvent, 'preventDefault').and.callThrough();
    spyOn(focusEvent, 'stopPropagation').and.callThrough();
  });

  it('should create ItemCounterComponent', () => {
    expect(itemCounterComponent).toBeTruthy();
  });

  it('should call writeValue(value) with null value', () => {
    itemCounterComponent.writeValue(null);
    expect(itemCounterComponent.value).toEqual(0);
  });

  it('should call writeValue(value) with valid value', () => {
    itemCounterComponent.writeValue(3);
    expect(itemCounterComponent.value).toEqual(3);
  });

  it('should call onKeyDown(event: KeyboardEvent) where event contains a ArrowDown code', () => {
    keyBoardEvent.code = 'ArrowDown';
    itemCounterComponent.onKeyDown(keyBoardEvent as KeyboardEvent);

    expect(keyBoardEvent.preventDefault).toHaveBeenCalled();
    expect(keyBoardEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should call onKeyDown(event: KeyboardEvent) where event contains a ArrowUp code', () => {
    keyBoardEvent.code = 'ArrowUp';
    itemCounterComponent.onKeyDown(keyBoardEvent as KeyboardEvent);

    expect(keyBoardEvent.preventDefault).toHaveBeenCalled();
    expect(keyBoardEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should call onKeyDown(event: KeyboardEvent) where event contains a invalid code', () => {
    keyBoardEvent.code = 'InvalidCode';
    itemCounterComponent.onKeyDown(keyBoardEvent as KeyboardEvent);

    expect(keyBoardEvent.preventDefault).not.toHaveBeenCalled();
    expect(keyBoardEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it('should call onBlur(event: FocusEvent)', () => {
    itemCounterComponent.onBlur(focusEvent);

    expect(itemCounterComponent.focus).toBeFalsy();
    expect(focusEvent.preventDefault).toHaveBeenCalled();
    expect(focusEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should call onFocus(event: FocusEvent)', () => {
    itemCounterComponent.onFocus(focusEvent);

    expect(itemCounterComponent.focus).toBeTruthy();
    expect(focusEvent.preventDefault).toHaveBeenCalled();
    expect(focusEvent.stopPropagation).toHaveBeenCalled();
  });

  describe('increment()', () => {
    it('should increment value when it is less than max', () => {
      itemCounterComponent.value = 1;
      itemCounterComponent.min = 1;
      itemCounterComponent.max = 2;
      itemCounterComponent.increment();

      expect(itemCounterComponent.value).toEqual(2);
      expect(itemCounterComponent.update.emit).toHaveBeenCalled();
    });

    it('should set focus when value is incremented', () => {
      const isIncremented = true;
      itemCounterComponent.setFocus(isIncremented);
      itemCounterComponent.increment();

      expect(isInputFocused).toBeFalsy();
      expect(isDecrementBtnFocused).toBeFalsy();
      expect(isIncrementBtnFocused).toBeTruthy();
    });

    it('should set value to max when it is greater than max', () => {
      itemCounterComponent.value = 3;
      itemCounterComponent.min = 1;
      itemCounterComponent.max = 2;
      itemCounterComponent.increment();

      expect(itemCounterComponent.value).toEqual(2);
      expect(itemCounterComponent.update.emit).toHaveBeenCalled();
    });
  });

  describe('decrement()', () => {
    it('should decrement value when it is greater than min', () => {
      itemCounterComponent.value = 3;
      itemCounterComponent.min = 2;
      itemCounterComponent.max = 5;
      itemCounterComponent.decrement();

      expect(itemCounterComponent.value).toEqual(2);
      expect(itemCounterComponent.update.emit).toHaveBeenCalled();
    });
    it('should set value to min when it is less than min', () => {
      itemCounterComponent.value = 1;
      itemCounterComponent.min = 2;
      itemCounterComponent.max = 5;
      itemCounterComponent.decrement();

      expect(itemCounterComponent.value).toEqual(2);
      expect(itemCounterComponent.update.emit).toHaveBeenCalled();
    });
    it('should set focus on the decrement button when value is decremented', () => {
      const isIncremented = false;
      itemCounterComponent.setFocus(isIncremented);

      expect(isInputFocused).toBeFalsy();
      expect(isIncrementBtnFocused).toBeFalsy();
      expect(isDecrementBtnFocused).toBeTruthy();
    });
  });

  it('should set focus on the input field when value is equal to min or equal to max', () => {
    itemCounterComponent.value = 1;
    itemCounterComponent.min = 1;
    itemCounterComponent.max = 5;
    const isIncremented = true;
    itemCounterComponent.setFocus(isIncremented);

    expect(isIncrementBtnFocused).toBeFalsy();
    expect(isDecrementBtnFocused).toBeFalsy();
    expect(isInputFocused).toBeTruthy();
  });

  it('should verify is value out of range', () => {
    itemCounterComponent.min = 1;
    itemCounterComponent.max = 5;

    testData.forEach(({ incomingValue, isMaxOrMinValueOrBeyond }) => {
      itemCounterComponent.value = incomingValue;
      expect(itemCounterComponent.isMaxOrMinValueOrBeyond()).toBe(
        isMaxOrMinValueOrBeyond
      );
    });
  });

  it('should not display input when isValueChangeable is false', () => {
    itemCounterComponent.isValueChangeable = false;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('input.cx-counter-value'))
    ).toBeFalsy();
    expect(
      fixture.debugElement.query(By.css('div.cx-counter-value'))
    ).toBeTruthy();
  });

  it('should display input when isValueChangeable is true', () => {
    itemCounterComponent.isValueChangeable = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('input.cx-counter-value'))
    ).toBeTruthy();
    expect(
      fixture.debugElement.query(By.css('div.cx-counter-value'))
    ).toBeFalsy();
  });

  it('should adjust value in range', () => {
    itemCounterComponent.min = 1;
    itemCounterComponent.max = 5;

    testData.forEach(({ incomingValue, adjustedValue }) => {
      expect(itemCounterComponent.adjustValueInRange(incomingValue)).toEqual(
        adjustedValue
      );
    });
  });

  it('should try set manual change with value', () => {
    itemCounterComponent.min = 1;
    itemCounterComponent.max = 5;

    testData.forEach(({ incomingValue, adjustedValue }) => {
      itemCounterComponent.manualChange(incomingValue);

      expect(itemCounterComponent.adjustValueInRange).toHaveBeenCalledWith(
        incomingValue
      );
      expect(itemCounterComponent.updateValue).toHaveBeenCalledWith(
        adjustedValue
      );
    });
  });

  it('should call manualChange with value', fakeAsync(() => {
    itemCounterComponent.isValueChangeable = true;
    itemCounterComponent.ngOnInit();
    fixture.detectChanges();

    const event = value => ({
      key: value,
      target: { value },
    });
    const inputEl = fixture.debugElement.query(By.css('input'));
    inputEl.triggerEventHandler('input', event('5'));
    tick(300);
    expect(itemCounterComponent.manualChange).toHaveBeenCalledWith(5);
  }));

  it('should disable/enable input based on cartIsLoading', () => {
    itemCounterComponent.cartIsLoading = true;
    itemCounterComponent.ngOnChanges();
    fixture.detectChanges();
    expect(itemCounterComponent.inputValue.disabled).toBeTruthy();

    itemCounterComponent.cartIsLoading = false;
    itemCounterComponent.ngOnChanges();
    fixture.detectChanges();
    expect(itemCounterComponent.inputValue.disabled).toBeFalsy();
  });

  it('should not display decrement or increment button when isValueChangeable is false', () => {
    itemCounterComponent.isValueChangeable = false;
    itemCounterComponent.ngOnChanges();
    fixture.detectChanges();
    expect(itemCounterComponent.decrementBtn).toBeUndefined();
    expect(itemCounterComponent.incrementBtn).toBeUndefined();
  });
});
