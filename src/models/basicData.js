import { fakeDeptTreeData } from '@/services/basicData';

export default {
  namespace: 'basicData',

  state: {
    deptTreeData: [],
  },

  effects: {
    *getDeptTreeData ({ payload }, { call, put }) {
      const response = yield call(fakeDeptTreeData, payload);
      yield put({
        type: 'saveDeptTreeData',
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
  },
};
