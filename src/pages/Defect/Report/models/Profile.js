import { fakeGet, fakeCheck, fakeUncheck } from '@/services/Defect/Report';

export default {
  namespace: 'reportProfile',

  state: {
    details: [],
    newBill: {},
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
    *check({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeCheck, id);
      if (id > 0) {
        const newBill = yield call(fakeGet, id);
        yield put({
          type: 'save',
          payload: { newBill },
        });
      }

      return response;
    },
    *uncheck({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeUncheck, id);
      if (id > 0) {
        const newBill = yield call(fakeGet, id);
        yield put({
          type: 'save',
          payload: { newBill },
        });
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
