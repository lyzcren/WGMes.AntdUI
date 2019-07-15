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
      let treeData = [];
      if (response && response.length > 0) {
        treeData = JSON.parse(JSON.stringify(response));
        treeData.forEach(top => {
          top.children.forEach(workshop => {
            workshop.children = null;
          });
        });
      }
      yield put({
        type: 'save',
        payload: { data: { list: response }, treeData },
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
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
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
