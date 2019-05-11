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
    *fetchParams({ payload, callback }, { call, put }) {
      const response = yield call(fakeQueryParams, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *saveParams({ payload, callback }, { call, put }) {
      const response = yield call(fakeSaveParams, payload);

      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
