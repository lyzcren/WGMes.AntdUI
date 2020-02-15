import { fakeAdd, fakeScan } from '@/services/Prod/Report';

export default {
  namespace: 'reportCreate',

  state: {
    details: [],
  },

  effects: {
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);

      yield put({
        type: 'save',
        payload: { queryResult: response || {} },
      });

      return response;
    },
    *changeDetails({ payload }, { call, put }) {
      const { details } = payload;
      yield put({
        type: 'save',
        payload: { details },
      });
    },
    *scan({ payload }, { call, put, select }) {
      const response = yield call(fakeScan, payload.batchNo);
      const details = yield select(state => state.reportCreate.details);
      if (response && !details.find(x => x.fInterID === response.fInterID)) {
        details.push(response);
      }
      yield put({
        type: 'save',
        payload: { details },
      });
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
