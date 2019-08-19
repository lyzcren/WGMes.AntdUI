import { fakeGet } from '@/services/Prod/Record';

export default {
  namespace: 'recordProfile',

  state: {
    data: {},
  },

  effects: {
    *initModel({ payload, callback }, { call, put }) {
      const data = yield call(fakeGet, payload);
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
      if (callback) callback();
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
