import { fakeQuery } from '@/services/Prod/PassInv';

export default {
  namespace: 'passInvManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      // console.log(response);
      yield put({
        type: 'save',
        payload: { data: response },
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
