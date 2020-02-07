import { queryNotices } from '@/services/api';
import { routerRedux } from 'dva/router';
import { fakeFetch } from '@/services/Sys/BusinessConfig';
import { modeValueMaps } from '@/utils/GlobalConst';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    loadedAllNotices: false,
    isFullScreen: false,
    businessConfig: { allowLoginModes: '', defaultLoginMode: [] },
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      const loadedAllNotices = data && data.length && data[data.length - 1] === null;
      yield put({
        type: 'setLoadedStatus',
        payload: loadedAllNotices,
      });
      yield put({
        type: 'saveNotices',
        payload: data.filter(item => item),
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *fetchMoreNotices({ payload }, { call, put, select }) {
      const data = yield call(queryNotices, payload);
      const loadedAllNotices = data && data.length && data[data.length - 1] === null;
      yield put({
        type: 'setLoadedStatus',
        payload: loadedAllNotices,
      });
      yield put({
        type: 'pushNotices',
        payload: data.filter(item => item),
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    *fetchBusinessConfig({}, { call, put }) {
      const response = yield call(fakeFetch);
      let configs = {};
      response.forEach(item => {
        const { fNumber, fValue } = item;
        if (fNumber === 'allowLoginModes') {
          configs[fNumber] = Object.keys(modeValueMaps).filter(x => modeValueMaps[x] & fValue);
        } else if (fNumber === 'defaultLoginMode') {
          configs[fNumber] = Object.keys(modeValueMaps).find(x => modeValueMaps[x] == fValue);
        } else {
          configs[fNumber] = fValue;
        }
      });
      yield put({
        type: 'saveBusinessConfig',
        payload: { ...configs },
      });
      return configs;
    },
    *fullScreen({ payload }, { put }) {
      const { isFullScreen } = payload;
      yield put({
        type: 'changeFullScreen',
        payload: { isFullScreen },
      });
    },
    *quickOps({}, { put }) {
      yield put(routerRedux.replace('/quickOps'));
    },
    *moreOps({}, { put }) {
      yield put(routerRedux.replace('/'));
    },
  },

  reducers: {
    saveBusinessConfig(state, { payload }) {
      return {
        ...state,
        businessConfig: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    pushNotices(state, { payload }) {
      return {
        ...state,
        notices: [...state.notices, ...payload],
      };
    },
    setLoadedStatus(state, { payload }) {
      return {
        ...state,
        loadedAllNotices: payload,
      };
    },
    changeFullScreen(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
