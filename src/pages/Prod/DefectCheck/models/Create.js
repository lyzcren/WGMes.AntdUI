import { fakeAdd, fakeInvByDept } from '@/services/Prod/DefectCheck';

export default {
  namespace: 'defectCheckCreate',

  state: {
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);

      yield put({
        type: 'save',
        payload: { queryResult: response ? response : {} },
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
