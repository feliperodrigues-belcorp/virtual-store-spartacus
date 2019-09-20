import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartAdapter } from './cart.adapter';
import { CartConnector } from './cart.connector';
import createSpy = jasmine.createSpy;

class MockCartAdapter implements CartAdapter {
  create = createSpy().and.callFake(id => of('create' + id));
  load = createSpy().and.callFake((user, cart) => of('load' + user + cart));
  loadAll = createSpy().and.callFake(user => of('loadAll' + user));
}

describe('CartConnector', () => {
  let service: CartConnector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CartAdapter, useClass: MockCartAdapter }],
    });

    service = TestBed.get(CartConnector as Type<CartConnector>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create should call adapter', () => {
    const adapter = TestBed.get(CartAdapter as Type<CartAdapter>);

    let result;
    service.create('1').subscribe(res => (result = res));
    expect(result).toBe('create1');
    expect(adapter.create).toHaveBeenCalledWith('1', undefined, undefined);
  });

  it('load should call adapter', () => {
    const adapter = TestBed.get(CartAdapter as Type<CartAdapter>);

    let result;
    service.load('1', '4').subscribe(res => (result = res));
    expect(result).toBe('load14');
    expect(adapter.load).toHaveBeenCalledWith('1', '4');
  });

  it('loadAll should call adapter', () => {
    const adapter = TestBed.get(CartAdapter as Type<CartAdapter>);

    let result;
    service.loadAll('1').subscribe(res => (result = res));
    expect(result).toBe('loadAll1');
    expect(adapter.loadAll).toHaveBeenCalledWith('1');
  });
});
