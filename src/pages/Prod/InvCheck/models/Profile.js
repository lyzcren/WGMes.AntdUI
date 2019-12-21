import { fakeGet, fakeInvByDept } from '@/services/Prod/InvCheck';

export default {
  namespace: 'invCheckProfile',

  state: {
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);

      yield put({
        type: 'save',
        payload: { profile: response || {} },
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
