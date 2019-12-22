import { fakeGetDepts, fakeReject } from '@/services/Prod/Flow';

export default {
  namespace: 'quickReject',

  state: {
    rejectDepts: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *reject({ payload }, { call, put }) {
      const response = yield call(fakeReject, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *getRejctDepts({ payload }, { call, put }) {
      const response = yield call(fakeGetDepts, payload);
      yield put({
        type: 'save',
        payload: { rejectDepts: response },
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
