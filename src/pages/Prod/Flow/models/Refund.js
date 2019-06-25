import { fakeGetRecord, fakeRefund } from '@/services/Prod/Flow';

export default {
  namespace: 'flowRefund',

  state: {
    records: [],
    lastRecord: {},

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const response = yield call(fakeGetRecord, payload);
      const lastRecord = [...response].reverse().find(x => x.fStatus > 1);

      yield put({
        type: 'save',
        payload: { records: response, lastRecord: lastRecord ? lastRecord : {} },
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
