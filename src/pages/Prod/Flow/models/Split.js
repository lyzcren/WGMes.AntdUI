import { fakeSplit } from '@/services/Prod/BatchSplit';

export default {
  namespace: 'flowSplit',

  state: {
    records: [],
  },

  effects: {
    *split({ payload }, { call, put }) {
      const response = yield call(fakeSplit, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'flowManage/fetch',
        });
      }

      return response;
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
