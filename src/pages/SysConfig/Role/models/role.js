import { queryRole, removeRole, addRole, updateRole, activeRole, getAuthority } from '@/services/role';

export default {
  namespace: 'roleManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    status: 'ok',
    message: '',
  },

  effects: {
    *fetch ({ payload }, { call, put }) {
      const response = yield call(queryRole, payload);
      yield put({
        type: 'query',
        payload: response,
      });
    },
    *add ({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove ({ payload, callback }, { call, put }) {
      const response = yield call(removeRole, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *update ({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *active ({ payload, callback }, { call, put }) {
      const response = yield call(activeRole, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
    *getAuthority ({ payload, callback }, { call, put }) {
      const response = yield call(getAuthority, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    query (state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateData (state, action) {
      console.log(state);
      return {
        ...state,
        status: action.payload.status,
        message: action.payload.message,
      };
    },
  },
};
