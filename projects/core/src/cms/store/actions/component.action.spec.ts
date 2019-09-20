import { CmsComponent } from '../../../model/cms.model';
import { StateEntityLoaderActions } from '../../../state/utils/index';
import { COMPONENT_ENTITY } from '../cms-state';
import { CmsActions } from './index';

describe('Cms Component Actions', () => {
  const test_uid = 'test_uid';

  describe('LoadCmsComponent Actions', () => {
    describe('LoadCmsComponent', () => {
      it('should create an action', () => {
        const payload = test_uid;
        const action = new CmsActions.LoadCmsComponent(payload);
        expect({ ...action }).toEqual({
          type: CmsActions.LOAD_CMS_COMPONENT,
          payload: payload,
          meta: StateEntityLoaderActions.entityLoadMeta(
            COMPONENT_ENTITY,
            test_uid
          ),
        });
      });
    });

    describe('LoadCmsComponentFail', () => {
      it('should create an action', () => {
        const payload = { message: 'Load Error' };
        const action = new CmsActions.LoadCmsComponentFail(test_uid, payload);

        expect({ ...action }).toEqual({
          type: CmsActions.LOAD_CMS_COMPONENT_FAIL,
          payload,
          meta: StateEntityLoaderActions.entityFailMeta(
            COMPONENT_ENTITY,
            test_uid,
            payload
          ),
        });
      });
    });

    describe('LoadCmsComponentSuccess', () => {
      it('should create an action', () => {
        const component: CmsComponent = {
          uid: 'comp1',
          typeCode: 'SimpleBannerComponent',
        };
        const action = new CmsActions.LoadCmsComponentSuccess(component);

        expect({ ...action }).toEqual({
          type: CmsActions.LOAD_CMS_COMPONENT_SUCCESS,
          payload: component,
          meta: StateEntityLoaderActions.entitySuccessMeta(
            COMPONENT_ENTITY,
            'comp1'
          ),
        });
      });
    });
  });

  describe('CmsGetComponentFromPage Action', () => {
    describe('Get Component from Page', () => {
      it('should create an action', () => {
        const component1: CmsComponent = { uid: 'uid1' };
        const component2: CmsComponent = { uid: 'uid2' };
        const action = new CmsActions.CmsGetComponentFromPage([
          component1,
          component2,
        ]);
        expect({ ...action }).toEqual({
          type: CmsActions.CMS_GET_COMPONENET_FROM_PAGE,
          payload: [component1, component2],
          meta: StateEntityLoaderActions.entitySuccessMeta(COMPONENT_ENTITY, [
            'uid1',
            'uid2',
          ]),
        });
      });
    });
  });
});
