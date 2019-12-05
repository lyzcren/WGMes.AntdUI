import { fakeGet } from '@/services/Prod/Flow';

export default {
  namespace: 'flowScan',

  state: {
    data: {},
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);
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
