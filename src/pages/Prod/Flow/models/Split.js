import { fakeSplit } from '@/services/Prod/BatchSplit';

export default {
  namespace: 'flowSplit',

  state: {
    records: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *split({ payload }, { call, put }) {
      const response = yield call(fakeSplit, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
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
