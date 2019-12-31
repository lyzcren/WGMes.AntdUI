import {
  fakeDeptTreeData,
  fakeProcessDeptTree,
  fakeGetAuthorizeProcessTree,
  fakeGetWorkShops,
  fakeMachineData,
  fakeGetRouteData,
  fakeGetTechParamData,
  fakeGetTechParamValues,
  fakeGetDefect,
  fakeGetOperatorList,
  fakeGetBillNo,
  fakeKeyValues,
  fakeGetWorkTime,
} from '@/services/basicData';
import { fakeGetAll as fakeGetUnit } from '@/services/Basic/Unit';
import { fakeQueryRootUrl } from '@/services/Sys/PrintTemplate';
import { fakeGetAll as fakeGetUnitConverter } from '@/services/Basic/UnitConverter';

export default {
  namespace: 'basicData',

  state: {
    deptTreeData: [],
    processDeptTree: [],
    authorizeProcessTree: [],
    workshops: [],
    machineData: [],
    routeData: [],
    paramData: [],
    defectData: [],
    operators: [],
    billNo: {},
    status: {},
    workTimes: [],
    paramType: [],
    matchTypes: [],
    Units: [],
    unitConverters: [],
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
    *getAuthorizeProcessTree({ payload }, { call, put }) {
      const response = yield call(fakeGetAuthorizeProcessTree, payload);
      yield put({
        type: 'save',
        payload: { authorizeProcessTree: response },
      });
    },
    *getWorkShops({ payload }, { call, put }) {
      const response = yield call(fakeGetWorkShops, payload);
      yield put({
        type: 'save',
        payload: { workshops: response },
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
      const response = yield call(fakeKeyValues, number);
      const newStatus = yield select(state => state.basicData.status);
      newStatus[number] = response;
      yield put({
        type: 'save',
        payload: { status: newStatus },
      });
    },
    *getWorkTime({ payload }, { call, put }) {
      const response = yield call(fakeGetWorkTime, payload);
      yield put({
        type: 'save',
        payload: { workTimes: response },
      });
    },
    *getPrintRootUrl({ payload }, { call, put }) {
      const response = yield call(fakeQueryRootUrl, payload);
      yield put({
        type: 'save',
        payload: { printUrl: response.message },
      });
    },
    *getParamType({}, { call, put }) {
      const response = yield call(fakeKeyValues, 'ParamType');
      yield put({
        type: 'save',
        payload: { paramType: response },
      });
    },
    *getUnits({}, { call, put }) {
      const response = yield call(fakeGetUnit);
      yield put({
        type: 'save',
        payload: { Units: response },
      });
    },
    *getUnitConverter({}, { call, put }) {
      const response = yield call(fakeGetUnitConverter);
      yield put({
        type: 'save',
        payload: { unitConverters: response },
      });
    },
    *getMatchType({}, { call, put }) {
      const response = yield call(fakeKeyValues, 'MatchType');
      yield put({
        type: 'save',
        payload: { matchTypes: response },
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
