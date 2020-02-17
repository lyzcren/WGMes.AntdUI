import { fakeFecthReportInv } from '@/services/Prod/PassInv';

export default {
  namespace: 'reportChooseForm',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const response = yield call(fakeFecthReportInv, payload);
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
