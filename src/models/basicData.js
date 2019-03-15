import { fakeDeptTreeData, fakeGetRouteData, fakeGetBillNo } from '@/services/basicData';

export default {
  namespace: 'basicData',

  state: {
    deptTreeData: [],
    routeData: [],
    billNo: {},
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
    *getBillNo ({ payload }, { call, put }) {
      const response = yield call(fakeGetBillNo, payload);
      yield put({
        type: 'saveBillNoData',
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
    saveBillNoData (state, action) {
      const billNoRule = action.payload;
      const newBillNo = { ...state.billNo };
      newBillNo[billNoRule.fNumber] = billNoRule.fCurrentNo;
      return {
        ...state,
        billNo: newBillNo,
      };
    },
  },
};
