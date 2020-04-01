import { fakeQuery, fakeGet, fakeQueryDetails } from '@/services/Rpt/PassRate';

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
    *fetch ({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *fetchDetails ({ payload }, { call, put }) {
      const response = yield call(fakeQueryDetails, payload);
      const head = yield call(fakeGet, payload);
      console.log(head);
      yield put({
        type: 'save',
        payload: { head, details: response },
      });
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
