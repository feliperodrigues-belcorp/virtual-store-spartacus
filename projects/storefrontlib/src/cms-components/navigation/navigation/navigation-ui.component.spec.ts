import {
  Component,
  DebugElement,
  ElementRef,
  Input,
  Renderer2,
  Type,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nTestingModule } from '@spartacus/core';
import { NavigationNode } from './navigation-node.model';
import { NavigationUIComponent } from './navigation-ui.component';

@Component({
  selector: 'cx-icon',
  template: '',
})
class MockIconComponent {
  @Input() type: string;
}

@Component({
  selector: 'cx-generic-link',
  template: '',
})
class MockGenericLinkComponent {
  @Input() url: string | any[];
  @Input() target: string;
  @Input() title: string;
}

const childLength = 9;

const mockNode: NavigationNode = {
  title: 'test',
  children: [
    {
      title: 'Root 1',
      url: '/root-1',
      children: [
        {
          title: 'Child 1',
          children: [
            {
              title: 'Sub child 1',
              children: [
                {
                  title: 'Sub sub child 1',
                  url: '/sub-sub-child-1',
                },
                {
                  title: 'Sub sub child 1',
                  url: '/sub-sub-child-1',
                },
                {
                  title: 'Sub sub child 1',
                  url: '/sub-sub-child-1',
                },
                {
                  title: 'Sub sub child 1',
                  url: '/sub-sub-child-1',
                },
              ],
            },
          ],
        },
        {
          title: 'Child 2',
          url: '/child-2',
        },
      ],
    },
    {
      title: 'Root 2',
      url: '/root-2',
    },
  ],
};

describe('Navigation UI Component', () => {
  let fixture: ComponentFixture<NavigationUIComponent>;
  let navigationComponent: NavigationUIComponent;
  let element: DebugElement;
  let renderer2: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, I18nTestingModule],
      declarations: [
        NavigationUIComponent,
        MockIconComponent,
        MockGenericLinkComponent,
      ],
      providers: [Renderer2],
    }).compileComponents();
  });

  describe('UI tests', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(NavigationUIComponent);
      navigationComponent = fixture.debugElement.componentInstance;
      element = fixture.debugElement;
      renderer2 = fixture.componentRef.injector.get<Renderer2>(
        Renderer2 as Type<Renderer2>
      );

      navigationComponent.node = mockNode;
    });

    it('should be created', () => {
      expect(navigationComponent).toBeTruthy();
    });

    it('should render back button for flyout navigation', () => {
      fixture.detectChanges();
      const backButton: ElementRef = element.query(By.css('.back'));
      const link: HTMLLinkElement = backButton.nativeElement;

      expect(link).toBeDefined();
    });

    it('should not render back button for non-flyout navigation', () => {
      navigationComponent.flyout = false;
      fixture.detectChanges();
      const backButton: ElementRef = element.query(By.css('.back'));

      expect(backButton).toBeFalsy();
    });

    it('should render cx-icon element for a nav node with children in flyout mode', () => {
      fixture.detectChanges();
      const icon: ElementRef = element.query(By.css('h5 > cx-icon'));
      const link: HTMLLinkElement = icon.nativeElement;

      expect(link).toBeDefined();
    });

    it('should not render cx-icon element for a nav node with children not in flyout mode', () => {
      navigationComponent.flyout = false;
      fixture.detectChanges();
      const icon: ElementRef = element.query(By.css('h5 > cx-icon'));

      expect(icon).toBeFalsy();
    });

    it('should render all link for root 1', () => {
      fixture.detectChanges();
      const allLink: ElementRef[] = element.queryAll(By.css('.wrapper > .all'));
      expect(allLink.length).toEqual(1);
    });

    it('should render ' + childLength + ' nav elements', () => {
      fixture.detectChanges();
      const nav: ElementRef[] = element.queryAll(By.css('nav'));
      expect(nav.length).toEqual(childLength);
    });

    it('should render 2 root nav elements', () => {
      fixture.detectChanges();
      // mmm... no `> nav` available in By.css
      let rootNavElementCount = 0;
      (<HTMLElement>element.nativeElement).childNodes.forEach(el => {
        if (el.nodeName === 'NAV') {
          rootNavElementCount++;
        }
      });
      expect(rootNavElementCount).toEqual(2);
    });

    it('should render heading for nav nodes without a URL', () => {
      fixture.detectChanges();

      const nav: ElementRef = element.query(By.css('nav > h5'));
      const el: HTMLElement = nav.nativeElement;
      expect(el.innerText).toEqual('Root 1');
    });

    it('should render link for nav nodes with a URL', () => {
      fixture.detectChanges();

      const nav: ElementRef = element.query(By.css('nav > cx-generic-link'));
      const el: HTMLElement = nav.nativeElement;
      expect(el).toBeTruthy();
    });

    it('should render a wrapper container for nav nodes with childs', () => {
      fixture.detectChanges();

      const wrapper: ElementRef[] = element.queryAll(By.css('nav .wrapper'));
      expect(wrapper.length).toEqual(3);
    });

    it('should render a childs container for nav nodes with childs', () => {
      fixture.detectChanges();

      const child: ElementRef[] = element.queryAll(By.css('nav .childs'));
      expect(child.length).toEqual(3);
    });

    it('should render a depth attribute on child containers indicating the depth of the navigation ', () => {
      fixture.detectChanges();

      const child: ElementRef[] = element.queryAll(By.css('nav .childs'));
      const first: HTMLElement = child[0].nativeElement;
      const second: HTMLElement = child[1].nativeElement;
      const third: HTMLElement = child[2].nativeElement;
      expect(first.attributes.getNamedItem('depth').value).toEqual('3');
      expect(second.attributes.getNamedItem('depth').value).toEqual('2');
      expect(third.attributes.getNamedItem('depth').value).toEqual('1');
    });

    it('should render child element in the childs container for nav nodes with childs', () => {
      fixture.detectChanges();

      const child: ElementRef[] = element.queryAll(
        By.css('nav div .childs nav')
      );
      expect(child.length).toEqual(7);
    });

    it('should focus hovered element when another is focused', () => {
      fixture.detectChanges();

      const rootNavElements: DebugElement[] = element.queryAll(
        By.css('div.flyout > nav')
      );
      const first: HTMLElement = rootNavElements[0].nativeElement;
      const second: HTMLElement = rootNavElements[1].nativeElement;

      // First element should not focus when no element is focused
      expect(first).not.toBe(<HTMLElement>document.activeElement);

      const listenFocusSecond = renderer2.listen(second, 'focus', () => {
        listenFocusSecond();

        // Second element should be focused
        expect(<HTMLElement>document.activeElement).toBe(second);

        // Hover mouse over first element
        navigationComponent.focusAfterPreviousClicked(
          new MouseEvent('mouseenter', {
            relatedTarget: first,
          })
        );

        first.dispatchEvent(new FocusEvent('focus', { relatedTarget: first }));
      });

      const listenFocusFirst = renderer2.listen(first, 'focus', () => {
        listenFocusFirst();

        // First element should become focused
        expect(<HTMLElement>document.activeElement).toBe(first);
      });

      // Focus on second element
      second.focus();
      second.dispatchEvent(new FocusEvent('focus', { relatedTarget: second }));
    });
  });
});
