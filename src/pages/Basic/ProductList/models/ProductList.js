import {
  fakeQuery,
  fakeQueryErp,
  fakeRemove,
  fakeAdd,
  fakeUpdateRoute,
  fakeActive,
  fakeSync,
  fakeIsSyncing,
} from '@/services/Basic/ProductList';

export default {
  namespace: 'productManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    dataErp: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    isSyncing: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *fetchErp({ payload }, { call, put }) {
      const response = yield call(fakeQueryErp, payload);
      yield put({
        type: 'saveDataErp',
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
    *sync({ payload }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *isSyncing({ payload }, { call, put }) {
      const response = yield call(fakeIsSyncing, payload);
      yield put({
        type: 'saveSyncing',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *updateRoute({ payload }, { call, put }) {
      const response = yield call(fakeUpdateRoute, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *active({ payload }, { call, put }) {
      const response = yield call(fakeActive, payload);
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
    saveDataErp(state, action) {
      return {
        ...state,
        dataErp: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
    saveSyncing(state, action) {
      return {
        ...state,
        isSyncing: action.payload ? action.payload.isSyncing : {},
      };
    },
  },
};
