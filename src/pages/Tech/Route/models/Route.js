import { fakeQuery, fakeRemove, fakeActive, fakeCheck } from '@/services/Tech/Route';

export default {
  namespace: 'routeManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *active({ payload, callback }, { call, put }) {
      const response = yield call(fakeActive, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *check({ payload, callback }, { call, put }) {
      const response = yield call(fakeCheck, { ...payload, check: true });
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *uncheck({ payload, callback }, { call, put }) {
      const response = yield call(fakeCheck, { ...payload, check: false });
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveQueryData(state, action) {
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
