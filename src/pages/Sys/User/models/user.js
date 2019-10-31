import {
  queryUser,
  removeUser,
  addUser,
  updateUser,
  updatePwd,
  fakeGetAuthorizeRole,
  fakeAuthorizeRole,
  activeUser,
  fakeUnAuthorizeRole,
} from '@/services/user';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';

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
    printTemplates: [],
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
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *updatePwd({ payload }, { call, put }) {
      const response = yield call(updatePwd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *active({ payload }, { call, put }) {
      const response = yield call(activeUser, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getAuthorizeRole({ payload }, { call, put }) {
      const response = yield call(fakeGetAuthorizeRole, payload);
      yield put({
        type: 'saveAuthorizeRole',
        payload: response,
      });
    },
    *authorizeRole({ payload, callback }, { call, put }) {
      const response = yield call(fakeAuthorizeRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *unAuthorizeRole({ payload }, { call, put }) {
      const response = yield call(fakeUnAuthorizeRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'sysUser' });
      yield put({
        type: 'save',
        payload: { printTemplates: response },
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
    query(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveData(state, action) {
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
