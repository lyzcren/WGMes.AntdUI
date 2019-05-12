import { fakeGetDepts } from '@/services/Prod/Flow';

export default {
  namespace: 'flowSign',

  state: {
    depts: [],
  },

  effects: {
    *getDepts({ payload }, { call, put }) {
      const response = yield call(fakeGetDepts, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
