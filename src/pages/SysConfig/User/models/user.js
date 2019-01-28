import { queryUser, removeUser, addUser, updateUser } from '@/services/user';

export default {
  namespace: 'userManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    status: 'ok',
    message: '',
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
        status: action.payload.status,
        message: action.payload.message,
      };
    },
  },
};
