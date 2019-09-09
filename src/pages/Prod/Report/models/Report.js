import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeCheck,
  fakeQueryGroupBy,
} from '@/services/Prod/Report';

export default {
  namespace: 'reportManage',

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
        payload: { data: response },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *check({ payload }, { call, put }) {
      const response = yield call(fakeCheck, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *fetchGroupBy({ payload }, { call, put }) {
      const response = yield call(fakeQueryGroupBy, payload);
      yield put({
        type: 'save',
        payload: { groupBys: response },
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
