import { fakeChangeRoute } from '@/services/Prod/ChangeRoute';
import { fakeGetRecord } from '@/services/Prod/Flow';
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
