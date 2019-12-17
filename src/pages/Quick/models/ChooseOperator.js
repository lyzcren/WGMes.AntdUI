import { fakeAccountLogin } from '@/services/api';

export default {
  namespace: 'chooseOperator',

  state: {
    currentUser: {},
  },

  effects: {
    *scan({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response.status === 'ok') {
        if (response.currentUser) {
          const { currentUser } = response;
          yield put({
            type: 'save',
            payload: { currentUser },
          });
        }
      }
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
