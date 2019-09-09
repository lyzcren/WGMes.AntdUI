import { fakeScan } from '@/services/Prod/Report';

export default {
  namespace: 'reportScan',

  state: {
    data: {},
  },

  effects: {
    *scan({ payload }, { call, put }) {
      const response = yield call(fakeScan, payload.batchNo);
      yield put({
        type: 'save',
        payload: { data: response },
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
