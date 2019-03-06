import { fakeQuery, fakeRemove, fakeAdd, fakeUpdate, fakeActive, fakeGetTreeData } from '@/services/Basic/Dept';

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
  },

  effects: {
    *fetch ({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add ({ payload, callback }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove ({ payload, callback }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update ({ payload, callback }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *active ({ payload, callback }, { call, put }) {
      const response = yield call(fakeActive, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *getTreeData ({ payload }, { call, put }) {
      alert('getTreeData');
      const response = yield call(fakeGetTreeData, payload);
      yield put({
        type: 'saveTreeData',
        payload: response,
      });
    },
  },

  reducers: {
    saveQueryData (state, action) {
      return {
        ...state,
        data: { list: action.payload },
      };
    },
    saveData (state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
    saveTreeData (state, action) {
      return {
        ...state,
        treeData: action.payload.list,
      };
    },
  },
};
