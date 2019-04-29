import { fakeQueryErp, fakeAdd, fakeSync, fakeIsSyncing, } from '@/services/Basic/ProductList';

export default {
  namespace: 'syncProductManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    isSyncing: false,
  },

  effects: {
    *fetch ({ payload }, { call, put }) {
      const response = yield call(fakeQueryErp, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add ({ payload, callback }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *sync ({ payload, callback }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *isSyncing ({ payload, callback }, { call, put }) {
      const response = yield call(fakeIsSyncing, payload);
      yield put({
        type: 'saveSyncing',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveQueryData (state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveData (state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
    saveSyncing (state, action) {
      return {
        ...state,
        isSyncing: action.payload ? action.payload : false,
      };
    },
  },
};
