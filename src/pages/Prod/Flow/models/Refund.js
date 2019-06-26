import { fakeGetRecord, fakeRefund } from '@/services/Prod/Flow';

export default {
  namespace: 'flowRefund',

  state: {
    records: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const response = yield call(fakeGetRecord, payload);

      yield put({
        type: 'save',
        payload: { records: response },
      });
    },
    *refund({ payload }, { call, put }) {
      const response = yield call(fakeRefund, payload);
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
