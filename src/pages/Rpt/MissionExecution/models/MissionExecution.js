import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeActive,
} from '@/services/Rpt/MissionExecution';

export default {
  namespace: 'missionExecutionManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
