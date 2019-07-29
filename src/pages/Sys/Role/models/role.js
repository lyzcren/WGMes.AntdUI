import {
  queryRole,
  removeRole,
  addRole,
  updateRole,
  getAuth,
  setAuth,
  getCurrentAuth,
  fakeGetAuthorizeUser,
  fakeAuthorizeUser,
  fakeUnAuthorizeUser,
  fakeActive,
  fakeDeactive,
} from '@/services/role';

export default {
  namespace: 'roleManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    authority: [],
    currentAuthority: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *active({ payload }, { call, put }) {
      const response = yield call(fakeActive, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *deactive({ payload }, { call, put }) {
      const response = yield call(fakeDeactive, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getAuthority({ payload, callback }, { call, put }) {
      const response = yield call(getAuth, payload);
      yield put({
        type: 'saveAuthority',
        payload: response,
      });
      if (callback) callback();
    },
    *getCurrentAuthority({ payload, callback }, { call, put }) {
      const response = yield call(getCurrentAuth, payload);
      yield put({
        type: 'saveCurrentAuthority',
        payload: response,
      });
      if (callback) callback();
    },
    *setAuthority({ payload, callback }, { call, put }) {
      const response = yield call(setAuth, payload);
      yield put({
        type: 'saveCurrentAuthority',
        payload: response,
      });
      if (callback) callback();
    },
    // 角色绑定用户
    *getAuthorizeUser({ payload, callback }, { call, put }) {
      const response = yield call(fakeGetAuthorizeUser, payload);
      yield put({
        type: 'saveAuthorizeUser',
        payload: response,
      });
      if (callback) callback();
    },
    *authorizeUser({ payload, callback }, { call, put }) {
      const response = yield call(fakeAuthorizeUser, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *unAuthorizeUser({ payload, callback }, { call, put }) {
      const response = yield call(fakeUnAuthorizeUser, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
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
        // status: action.payload.status,
        // message: action.payload.message,
        // authority: action.payload.authority,
      };
    },
    saveAuthority(state, action) {
      return {
        ...state,
        authority: action.payload.authority,
      };
    },
    saveCurrentAuthority(state, action) {
      return {
        ...state,
        currentAuthority: action.payload.currentAuthority,
      };
    },
    saveAuthorizeUser(state, action) {
      return {
        ...state,
        authorizeUser: action.payload,
      };
    },
  },
};
