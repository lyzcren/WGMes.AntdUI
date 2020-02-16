import { fakeSync, fakeCheckSyncing } from '@/services/Prod/Mission';
import { replace } from 'react-router-redux';

export default {
  namespace: 'missionSync',

  state: {
    queryResult: {
      status: 'ok',
      message: '',
    },
    isSyncing: false,
    totalCount: 0,
    currentCount: 0,
  },

  effects: {
    *sync({ payload }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response, isSyncing: true },
      });
      return response;
    },
    *syncing({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: { isSyncing: true, totalCount: 0, currentCount: 0 },
      });
    },
    *isSyncing({ payload }, { call, put }) {
      const response = yield call(fakeCheckSyncing, payload);
      yield put({
        type: 'save',
        payload: {
          isSyncing: response.isSyncing,
          totalCount: response.totalCount,
          currentCount: response.currentCount,
        },
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
  },
};
