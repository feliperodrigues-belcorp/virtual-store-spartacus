import { Product } from '../../../model/product.model';
import { StateEntityLoaderActions } from '../../../state/utils/index';
import { PRODUCT_DETAIL_ENTITY } from '../product-state';
import * as fromProduct from './product.action';

describe('Product Actions', () => {
  describe('LoadProduct Actions', () => {
    describe('LoadProduct', () => {
      it('should create an action', () => {
        const productCode = 'testCode';
        const action = new fromProduct.LoadProduct(productCode);
        expect({ ...action }).toEqual({
          type: fromProduct.LOAD_PRODUCT,
          payload: productCode,
          meta: StateEntityLoaderActions.entityLoadMeta(
            PRODUCT_DETAIL_ENTITY,
            productCode
          ),
        });
      });
    });

    describe('LoadProductFail', () => {
      it('should create an action', () => {
        const payload = { message: 'Load Error' };
        const productCode = 'productCode';
        const action = new fromProduct.LoadProductFail(productCode, payload);

        expect({ ...action }).toEqual({
          type: fromProduct.LOAD_PRODUCT_FAIL,
          payload,
          meta: StateEntityLoaderActions.entityFailMeta(
            PRODUCT_DETAIL_ENTITY,
            productCode,
            payload
          ),
        });
      });
    });

    describe('LoadProductSuccess', () => {
      it('should create an action', () => {
        const payload: Product = { code: '123' };
        const action = new fromProduct.LoadProductSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromProduct.LOAD_PRODUCT_SUCCESS,
          payload,
          meta: StateEntityLoaderActions.entitySuccessMeta(
            PRODUCT_DETAIL_ENTITY,
            payload.code
          ),
        });
      });
    });
  });
});
