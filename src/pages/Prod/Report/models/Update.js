import { fakeGet, fakeUpdate, fakeCheck, fakeScan } from '@/services/Prod/Report';

export default {
  namespace: 'reportUpdate',

  state: {
    details: [],
  },

  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeGet, id);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      const { check, id } = payload;
      let response = yield call(fakeUpdate, payload);
      if (check && response.model) {
        response = yield call(fakeCheck, id);
      }

      return response;
    },
    *changeDetails({ payload }, { call, put }) {
      const { details } = payload;
      yield put({
        type: 'save',
        payload: { details },
      });
    },
    *scan({ payload }, { call, put, select }) {
      const response = yield call(fakeScan, payload);
      const details = yield select(state => state.reportUpdate.details);
      if (response) {
        // 设置默认汇报数量为可汇报数量
        response.fReportingQty = response.fUnReportQty;
        response.fInvID = response.fInterID;
        if (!details.find(x => x.fInterID === response.fInterID)) {
          details.push(response);
        }
        yield put({
          type: 'save',
          payload: { details },
        });
      }
      if (response) {
        return { success: true };
      }
      return { success: false, message: '未找到待汇报库存' };
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
