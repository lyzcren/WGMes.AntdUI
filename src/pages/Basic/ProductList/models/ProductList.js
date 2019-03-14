import { fakeQuery, fakeQueryErp, fakeRemove, fakeAdd, fakeUpdate, fakeActive } from '@/services/Basic/ProductList';

export default {
  namespace: 'productManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataErp: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch ({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *fetchErp ({ payload }, { call, put }) {
      const response = yield call(fakeQueryErp, payload);
      yield put({
        type: 'saveDataErp',
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
    *remove ({ payload, callback }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update ({ payload, callback }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *active ({ payload, callback }, { call, put }) {
      const response = yield call(fakeActive, payload);
      yield put({
        type: 'saveData',
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
    saveDataErp (state, action) {
      return {
        ...state,
        dataErp: action.payload,
      };
    },
    saveData (state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
