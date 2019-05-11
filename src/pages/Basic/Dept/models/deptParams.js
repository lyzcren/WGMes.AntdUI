import { fakeGetParams, fakeAddParams } from '@/services/Basic/Dept';
import { fakeQueryValue } from '@/services/Tech/Param';

export default {
  namespace: 'deptParamsManage',

  state: {
    data: [],
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeGetParams, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(fakeAddParams, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchValue({ payload }, { call, put }) {
      const response = yield call(fakeQueryValue, payload);
      yield put({
        type: 'saveParamValues',
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
  },
};
