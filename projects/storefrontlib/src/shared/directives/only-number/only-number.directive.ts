import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[cxOnlyNumber]',
})
export class OnlyNumberDirective {
  previousValue = '';
  integerUnsigned = '^[0-9]*$';
  /**
   * Class constructor
   * @param hostElement
   */
  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  /**
   * Event handler for host's change event
   */
  @HostListener('change')
  onChange() {
    this.validateValue(this.hostElement.nativeElement.value);
  }

  /**
   * Event handler for host's change event
   */
  @HostListener('input')
  onInput() {
    this.validateValue(this.hostElement.nativeElement.value);
  }

  /**
   * Event handler for host's paste event
   * @param e
   */
  @HostListener('paste', ['$event'])
  onPaste(e: ClipboardEvent) {
    const value = e.clipboardData.getData('text/plain');
    this.validateValue(value);
    e.preventDefault();
  }

  /**
   * Event handler for host's keyup event
   * @param e
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    const value = e.target['value'];
    this.validateValue(value);
  }

  /**
   * Event handler for host's keydown event
   * @param e
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const originalValue: string = e.target['value'];
    const key: string = this.getName(e);
    const controlOrCommand = e.ctrlKey === true || e.metaKey === true;

    // allowed keys apart from numeric characters
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Escape',
      'Tab',
    ];
    // allow some non-numeric characters
    if (
      allowedKeys.includes(key) ||
      // Allow: Ctrl+A and Command+A
      (key === 'a' && controlOrCommand) ||
      // Allow: Ctrl+C and Command+C
      (key === 'c' && controlOrCommand) ||
      // Allow: Ctrl+V and Command+V
      (key === 'v' && controlOrCommand) ||
      // Allow: Ctrl+X and Command+X
      (key === 'x' && controlOrCommand)
    ) {
      // let it happen, don't do anything
      return;
    }

    // save value before keydown event
    this.previousValue = originalValue;

    // allow number characters only
    const isNumber = new RegExp(this.integerUnsigned).test(key);
    if (isNumber) {
      return;
    } else {
      e.preventDefault();
    }
  }

  /**
   * Test whether value is a valid number or not
   * @param value
   */
  validateValue(value: string): void {
    value = value.replace(/[^0-9]+/g, '');
    this.renderer.setProperty(this.hostElement.nativeElement, 'value', value);
  }

  /**
   * Get key's name
   * @param e
   */
  getName(e: KeyboardEvent): string {
    return e.key;
  }
}
