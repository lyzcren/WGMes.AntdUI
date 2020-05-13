import { fakeQueryErp, fakeAdd, fakeSync, fakeIsSyncing } from '@/services/Basic/ProductList';

export default {
  namespace: 'syncProductManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    isSyncing: false,
    totalCount: 0,
    currentCount: 0,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQueryErp, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *sync({ payload }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response, isSyncing: true, totalCount: 0, currentCount: 0 },
      });

      return response;
    },
    *isSyncing({ payload }, { call, put }) {
      const response = yield call(fakeIsSyncing, payload);
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
      };
    },
    saveSyncing(state, action) {
      return {
        ...state,
        isSyncing: action.payload ? action.payload : false,
      };
    },
  },
};
