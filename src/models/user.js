import { query as queryUsers, queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch (_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent (_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser (state, action) {
      if (action.payload) {
        setAuthority(action.payload.currentAuthority);
        if (action.payload.token) {
          setToken(action.payload.token);
        }
      }
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
