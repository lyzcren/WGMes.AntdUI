import { fakeGet, fakeCheck, fakeUncheck } from '@/services/Defect/Repair';

export default {
  namespace: 'repairProfile',

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
    *check({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeCheck, id);

      return response;
    },
    *uncheck({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeUncheck, id);

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
