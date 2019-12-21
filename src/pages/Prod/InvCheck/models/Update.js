import { fakeUpdate, fakeInvByDept } from '@/services/Prod/InvCheck';

export default {
  namespace: 'invCheckUpdate',

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
        payload: { queryResult: response || {} },
      });
    },
    *getInvByDept({ payload }, { call, put }) {
      const response = yield call(fakeInvByDept, payload);

      yield put({
        type: 'save',
        payload: { details: response },
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
