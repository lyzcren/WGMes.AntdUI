import { fakeGetRecord, fakeChangeRoute } from '@/services/Prod/ChangeRoute';
import { fakeQuerySteps } from '@/services/Tech/Route';

export default {
  namespace: 'flowChangeRoute',

  state: {
    records: [],
    routeSteps: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const response = yield call(fakeGetRecord, payload);

      yield put({
        type: 'save',
        payload: { records: response },
      });
    },
    *routeChanged({ payload }, { call, put }) {
      const response = yield call(fakeQuerySteps, payload);

      yield put({
        type: 'save',
        payload: { routeSteps: response },
      });
    },
    *changeRoute({ payload }, { call, put }) {
      const response = yield call(fakeChangeRoute, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
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
