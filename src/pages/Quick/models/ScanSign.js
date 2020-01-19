import { fakeGetByBatchNo as fakeGet, fakeSign } from '@/services/Prod/Flow';

export default {
  namespace: 'scanSign',

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
        payload: { data: response },
      });
    },
    *signByBatchNo({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);
      const { fInterID } = response;
      if (fInterID > 0) {
        const response = yield call(fakeSign, { ...payload, fInterID });
        yield put({
          type: 'save',
          payload: { queryResult: response },
        });
      } else {
        yield put({
          type: 'save',
          payload: { queryResult: { status: 'warning', message: '未找到流程单' } },
        });
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
