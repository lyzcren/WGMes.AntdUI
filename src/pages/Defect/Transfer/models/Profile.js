import { fakeGet, fakeSign, fakeAntiSign } from '@/services/Defect/Transfer';

export default {
  namespace: 'transferProfile',

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
    *sign({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeSign, id);

      return response;
    },
    *antiSign({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeAntiSign, id);

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
