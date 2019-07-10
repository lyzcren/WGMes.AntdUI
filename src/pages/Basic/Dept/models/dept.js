import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeActive,
  fakeAddParams,
  fakeGetType,
  fakeSync,
} from '@/services/Basic/Dept';

export default {
  namespace: 'deptManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    treeData: [],
    typeData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
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
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
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
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
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
    *addParams({ payload }, { call, put }) {
      const response = yield call(fakeAddParams, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getType({ payload }, { call, put }) {
      const response = yield call(fakeGetType, payload);
      yield put({
        type: 'saveTypeData',
        payload: response,
      });
    },
  },

  reducers: {
    saveQueryData(state, action) {
      return {
        ...state,
        data: { list: action.payload },
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
    saveTreeData(state, action) {
      return {
        ...state,
        treeData: action.payload.list,
      };
    },
    saveTypeData(state, action) {
      return {
        ...state,
        typeData: action.payload,
      };
    },
  },
};
