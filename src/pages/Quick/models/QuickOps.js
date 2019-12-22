import { fakeMachineData } from '@/services/basicData';
import { fakeGetWorkTimes } from '@/services/Basic/Dept';
import { fakeGet } from '@/services/Prod/Flow';
import { fakeTake } from '@/services/Prod/Take';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'quickOps',

  state: {
    machineList: [],
    worktimeList: [],
    queryResult: {
      status: 'ok',
      message: '',
    },
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
    *getFlowByBatchNo({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);
      yield put({
        type: 'save',
        payload: { flow: response },
      });
    },
    *take({ payload }, { call, put }) {
      const response = yield call(fakeTake, payload);
      yield put({
        type: 'saveData',
        payload: response,
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
