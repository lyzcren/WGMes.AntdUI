import { fakeQuery, fakeGet, fakeSync } from '@/services/Prod/Mission';
import { fakeAddFromMission } from '@/services/Prod/Flow';

export default {
  namespace: 'missionManage',

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
    *get({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *sync({ payload, callback }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *genFlow({ payload }, { call, put }) {
      const response = yield call(fakeAddFromMission, payload);
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
