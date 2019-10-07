import { queryProjectNotice, queryServiceUri } from '@/services/api';

export default {
  namespace: 'project',

  state: {
    notice: [],
    uri: '',
  },

  effects: {
    *fetchNotice (_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchServiceUri (_, { call, put }) {
      const response = yield call(queryServiceUri);
      yield put({
        type: 'saveUri',
        payload: response,
      });
    },
  },

  reducers: {
    saveNotice (state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveUri (state, action) {
      return {
        ...state,
        uri: action.payload,
      };
    },
  },
};
