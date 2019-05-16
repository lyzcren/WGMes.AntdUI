import {
  fakeQuery,
  fakeSign,
  fakeReport,
  fakeRemove,
  fakeUpdate,
  fakeGetDepts,
  fakeGetRecord,
} from '@/services/Prod/Flow';

export default {
  namespace: 'flowManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    nextDepts: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *sign({ payload, callback }, { call, put }) {
      const response = yield call(fakeSign, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *report({ payload, callback }, { call, put }) {
      const response = yield call(fakeReport, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *getDepts({ payload }, { call, put }) {
      const response = yield call(fakeGetDepts, payload);
      yield put({
        type: 'saveDepts',
        payload: response,
      });
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
    saveDepts(state, action) {
      return {
        ...state,
        nextDepts: action.payload,
      };
    },
  },
};
