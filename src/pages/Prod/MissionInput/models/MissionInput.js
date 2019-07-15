import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeActive,
} from '@/services/Prod/MissionInput';

export default {
  namespace: 'missionInputManage',

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
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {
      const id = payload.fInterID;
      const response = yield call(fakeRemove, id);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      payload.id = payload.fInterID;
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
  },

  reducers: {
    saveQueryData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
