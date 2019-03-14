import { fakeDeptTreeData, fakeGetRouteData } from '@/services/basicData';

export default {
  namespace: 'basicData',

  state: {
    deptTreeData: [],
    routeData: [],
  },

  effects: {
    *getDeptTreeData ({ payload }, { call, put }) {
      const response = yield call(fakeDeptTreeData, payload);
      yield put({
        type: 'saveDeptTreeData',
        payload: response,
      });
    },
    *getRouteData ({ payload }, { call, put }) {
      const response = yield call(fakeGetRouteData, payload);
      yield put({
        type: 'saveRouteData',
        payload: response,
      });
    },
  },

  reducers: {
    saveDeptTreeData (state, action) {
      return {
        ...state,
        deptTreeData: action.payload,
      };
    },
    saveRouteData (state, action) {
      return {
        ...state,
        routeData: action.payload,
      };
    },
  },
};
