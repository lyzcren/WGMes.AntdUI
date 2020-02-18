import { fakeFecthReportInv } from '@/services/Prod/PassInv';

export default {
  namespace: 'reportChooseForm',

  state: {
    data: [],
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const response = yield call(fakeFecthReportInv, payload);
      response.forEach(item => {
        // 设置默认汇报数量为可汇报数量
        item.fReportingQty = item.fUnReportQty;
        item.fInvID = item.fInterID;
      });
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
