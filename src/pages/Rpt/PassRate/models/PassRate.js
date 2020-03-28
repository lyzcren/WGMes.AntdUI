import { fakeQuery, fakeQueryDetails } from '@/services/Rpt/PassRate';

export default {
  namespace: 'passRateManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    details: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *fetchDetails({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(fakeQueryDetails, payload);
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
