import { fakeMachineData } from '@/services/basicData';
import { fakeGetWorkTimes } from '@/services/Basic/Dept';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'quickOps',

  state: {
    machineList: [],
    worktimeList: [],
  },

  effects: {
    *getMachine({ payload }, { call, put }) {
      const response = yield call(fakeMachineData, payload);
      yield put({
        type: 'save',
        payload: { machineList: response },
      });
    },
    *getWorkTimes({ payload }, { call, put }) {
      const response = yield call(fakeGetWorkTimes, payload.fDeptID);
      yield put({
        type: 'save',
        payload: { worktimeList: response },
      });
    },
    *moreOperator({ payload }, { call, put }) {
      yield put(routerRedux.replace('/'));
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
