import { fakeGetRecord, fakeRefund } from '@/services/Prod/Flow';

export default {
  namespace: 'flowRefund',

  state: {
    records: [],
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
      if (response.status === 'ok') {
        yield put({
          type: 'flowManage/fetch',
        });
      }

      return response;
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
