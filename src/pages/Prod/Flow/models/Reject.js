import { fakeGetDepts, fakeReject } from '@/services/Prod/Flow';

export default {
  namespace: 'flowReject',

  state: {
    rejectDepts: [],
  },

  effects: {
    *reject({ payload }, { call, put }) {
      const response = yield call(fakeReject, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'flowManage/fetch',
        });
      }

      return response;
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
