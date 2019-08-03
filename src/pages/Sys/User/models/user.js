import {
  queryUser,
  removeUser,
  addUser,
  updateUser,
  fakeGetAuthorizeRole,
  fakeAuthorizeRole,
  activeUser,
  fakeUnAuthorizeRole,
} from '@/services/user';

export default {
  namespace: 'userManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    result: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'query',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *active({ payload }, { call, put }) {
      const response = yield call(activeUser, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    *getAuthorizeRole({ payload, callback }, { call, put }) {
      const response = yield call(fakeGetAuthorizeRole, payload);
      yield put({
        type: 'saveAuthorizeRole',
        payload: response,
      });
      if (callback) callback();
    },
    *authorizeRole({ payload, callback }, { call, put }) {
      const response = yield call(fakeAuthorizeRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *unAuthorizeRole({ payload, callback }, { call, put }) {
      const response = yield call(fakeUnAuthorizeRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    query(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateData(state, action) {
      return {
        ...state,
        result: action.payload ? action.payload : {},
      };
    },
    saveAuthorizeRole(state, action) {
      return {
        ...state,
        authorizeRole: action.payload,
      };
    },
  },
};
