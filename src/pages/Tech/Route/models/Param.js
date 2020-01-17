import { fakeQueryParams, fakeSaveParams } from '@/services/Tech/Route';

export default {
  namespace: 'routeParam',

  state: {
    data: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetchParams({ payload }, { call, put }) {
      const response = yield call(fakeQueryParams, payload);
      const list = response.map(x => {
        return { ...x, key: `${x.fDeptID}${x.fParamID}` };
      });
      yield put({
        type: 'save',
        payload: { data: list },
      });
    },
    *saveParams({ payload }, { call, put }) {
      const response = yield call(fakeSaveParams, payload);

      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
