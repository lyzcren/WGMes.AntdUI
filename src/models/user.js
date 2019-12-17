import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { query as queryUsers, queryCurrent } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';
import { reloadAuthorized } from '@/utils/Authorized';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { getPageQuery } from '@/utils/utils';

export default {
  namespace: 'user',

  state: {
    status: undefined,
    message: '',
    type: '',
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *saveCurrent(payload, { call, put }) {
      const { currentUser } = payload;
      yield put({
        type: 'saveCurrentUser',
        payload: { payload: currentUser },
      });
    },

    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      if (response) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      }
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        // 快速操作界面
        if (response.currentUser.indexPage === 'quickOps') {
          yield put(routerRedux.replace('/quickOps'));
        } else {
          yield put(routerRedux.replace(redirect || '/'));
        }
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      if (action.payload) {
        setAuthority(action.payload.currentAuthority);
        if (action.payload.fAccessToken) {
          setToken(action.payload.fAccessToken);
        }
      }
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    changeLoginStatus(state, { payload }) {
      const { currentUser } = payload;
      const { currentAuthority, fAccessToken } = currentUser || {};
      setAuthority(currentAuthority);
      setToken(fAccessToken);
      return {
        ...state,
        currentUser: payload,
        status: payload.status,
        type: payload.type,
        message: payload.message,
      };
    },
  },
};
