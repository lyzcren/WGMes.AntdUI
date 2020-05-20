import { fakeComment } from '@/services/Prod/Flow';

export default {
  namespace: 'flowComment',

  state: {},

  effects: {
    *comment({ payload }, { call, put }) {
      const response = yield call(fakeComment, payload);
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
