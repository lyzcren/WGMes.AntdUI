import { fakeQuery, fakeSync } from '@/services/Prod/MOPlan';

export default {
  namespace: 'mOPlanManage',

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
    *fetch ({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *sync ({ payload, callback }, { call, put }) {
      const response = yield call(fakeSync, payload);
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
    saveData (state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
