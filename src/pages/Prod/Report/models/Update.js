import { fakeUpdate } from '@/services/Prod/Report';

export default {
  namespace: 'reportUpdate',

  state: {
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);

      yield put({
        type: 'save',
        payload: { queryResult: response ? response : {} },
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
