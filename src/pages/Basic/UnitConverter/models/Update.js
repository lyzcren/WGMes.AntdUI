import { fakeUpdate, fakeGet } from '@/services/Basic/UnitConverter';
import { exists } from 'fs';

export default {
  namespace: 'unitConverterUpdate',

  state: {
    data: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const data = yield call(fakeGet, payload.id);
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'save',
        payload: response,
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
