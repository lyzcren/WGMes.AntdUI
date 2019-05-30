import { fakeGet, fakeInvByDept } from '@/services/Prod/DefectCheck';

export default {
  namespace: 'defectCheckProfile',

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
        payload: { profile: response ? response : {} },
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
