import {
  fakeDeptTreeData,
  fakeProcessDeptTree,
  fakeMachineData,
  fakeGetRouteData,
  fakeGetTechParamData,
  fakeGetTechParamValues,
  fakeGetDefect,
  fakeGetOperatorList,
  fakeGetBillNo,
  fakeGetStatus,
} from '@/services/basicData';

export default {
  namespace: 'basicData',

  state: {
    deptTreeData: [],
    processDeptTree: [],
    machineData: [],
    routeData: [],
    paramData: [],
    defectData: [],
    operators: [],
    billNo: {},
    status: {},
  },

  effects: {
    *getDeptTreeData({ payload }, { call, put }) {
      const response = yield call(fakeDeptTreeData, payload);
      yield put({
        type: 'saveDeptTreeData',
        payload: response,
      });
    },
    *getProcessDeptTree({ payload }, { call, put }) {
      const response = yield call(fakeProcessDeptTree, payload);
      yield put({
        type: 'saveProcessDeptTree',
        payload: response,
      });
    },
    *getMachineData({ payload }, { call, put }) {
      const response = yield call(fakeMachineData, payload);
      yield put({
        type: 'saveMachineData',
        payload: response,
      });
    },
    *getRouteData({ payload }, { call, put }) {
      const response = yield call(fakeGetRouteData, payload);
      yield put({
        type: 'saveRouteData',
        payload: response,
      });
    },
    *getParamData({ payload }, { call, put }) {
      const response = yield call(fakeGetTechParamData, payload);
      yield put({
        type: 'saveParamData',
        payload: response,
      });
    },
    *getDefectData({ payload }, { call, put }) {
      const response = yield call(fakeGetDefect, payload);
      yield put({
        type: 'saveDefectData',
        payload: response,
      });
    },
    *getOperator({ payload }, { call, put }) {
      const response = yield call(fakeGetOperatorList, payload);
      yield put({
        type: 'saveOperatorData',
        payload: response,
      });
    },
    *getBillNo({ payload }, { call, put }) {
      const response = yield call(fakeGetBillNo, payload);
      yield put({
        type: 'saveBillNoData',
        payload: response,
      });
    },
    *getStatus({ payload }, { call, put, select }) {
      const { number } = payload;
      const response = yield call(fakeGetStatus, number);
      const newStatus = yield select(state => state.basicData.status);
      newStatus[number] = response;
      yield put({
        type: 'save',
        payload: { status: newStatus },
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
    saveDeptTreeData(state, action) {
      return {
        ...state,
        deptTreeData: action.payload,
      };
    },
    saveProcessDeptTree(state, action) {
      return {
        ...state,
        processDeptTree: action.payload,
      };
    },
    saveMachineData(state, action) {
      return {
        ...state,
        machineData: action.payload,
      };
    },
    saveRouteData(state, action) {
      return {
        ...state,
        routeData: action.payload,
      };
    },
    saveParamData(state, action) {
      return {
        ...state,
        paramData: action.payload,
      };
    },
    saveDefectData(state, action) {
      return {
        ...state,
        defectData: action.payload,
      };
    },
    saveOperatorData(state, action) {
      return {
        ...state,
        operators: action.payload,
      };
    },
    saveBillNoData(state, action) {
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
