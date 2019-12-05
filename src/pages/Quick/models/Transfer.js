import { fakeGetProducingRecord, fakeTransfer } from '@/services/Prod/Record';
import { fakeGetDeptDefect, fakeMachineData } from '@/services/basicData';
import { fakeQueryParams } from '@/services/Tech/Route';
import { fakeGetWorkTimes } from '@/services/Basic/Dept';
import { defaultCipherList } from 'constants';
import { exists } from 'fs';
import numeral from 'numeral';

export default {
  namespace: 'flowTransfer',

  state: {
    data: {},
    defect: [],
    machineData: [],
    defectList: [],
    paramList: [],
    workTimes: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload, callback }, { call, put }) {
      const data = yield call(fakeGetProducingRecord, payload);
      data.fPassQty = data.fInputQty + data.fInvCheckDeltaQty - data.fTakeQty;
      yield put({
        type: 'save',
        payload: {
          data,
          defectList: [],
        },
      });
      if (callback) callback();
    },
    *getMachineData({ payload }, { call, put }) {
      const response = yield call(fakeMachineData, payload);
      yield put({
        type: 'saveMachineData',
        payload: response,
      });
    },
    *getParams({ payload }, { call, put }) {
      const response = yield call(fakeQueryParams, payload);
      response.forEach(p => {
        if (!p.values.includes(p.fDefaultValue)) {
          p.values.unshift(p.fDefaultValue);
        }
      });
      yield put({
        type: 'saveParam',
        payload: response,
      });
    },
    *changeParam({ payload }, { call, put, select }) {
      const { fParamID, fValue } = payload;
      const { paramList } = yield select(state => state.flowTransfer);
      const existsOne = paramList.find(x => x.fParamID == fParamID);
      if (existsOne) {
        existsOne.fValue = fValue;
      }
      yield put({
        type: 'saveParam',
        payload: paramList,
      });
    },
    *getDefect({ payload }, { call, put }) {
      const response = yield call(fakeGetDeptDefect, payload);

      yield put({
        type: 'saveDefect',
        payload: response,
      });
    },
    *changeDefect({ payload }, { call, put }) {
      yield put({
        type: 'changeDefectReducer',
        payload,
      });
    },
    *addDefect({ payload }, { call, put, select }) {
      const { fDefectID, fValue } = payload;
      const { defectList } = yield select(state => state.flowTransfer);
      const { defectData } = yield select(state => state.basicData);
      const existsOne = defectList.find(x => x.fItemID === fDefectID);
      const findItem = defectData.find(x => x.fItemID === fDefectID);

      if (existsOne) {
        existsOne.fValue = fValue;
      } else if (findItem) {
        const newItem = { ...findItem };
        newItem.fValue = fValue;
        defectList.push(newItem);
      }
      put({
        type: 'saveDefect',
        payload: defectList,
      });
    },
    *getWorkTimes({ payload }, { call, put }) {
      const response = yield call(fakeGetWorkTimes, payload.fDeptID);

      yield put({
        type: 'save',
        payload: { workTimes: response },
      });
    },
    *transfer({ payload }, { call, put }) {
      const response = yield call(fakeTransfer, payload);
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
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
        // data: (action.payload && action.payload.model) ? action.payload.model : state.data
      };
    },
    saveMachineData(state, action) {
      return {
        ...state,
        machineData: action.payload,
      };
    },
    saveParam(state, action) {
      return {
        ...state,
        paramList: action.payload,
      };
    },
    saveDefect(state, action) {
      return {
        ...state,
        defectList: action.payload ? action.payload : [],
      };
    },
    changeDefectReducer(state, action) {
      const {
        payload: { fDefectID, fValue },
      } = action;
      const { data, defect } = state;
      const existsDefect = defect.find(d => d.fDefectID === fDefectID);
      if (existsDefect) {
        existsDefect.fValue = fValue;
      } else {
        defect.push({ fDefectID, fValue });
      }
      const defectQty = defect
        .map(x => (x.fValue ? x.fValue : 0))
        .reduce((sum, x) => (sum += x * 1.0));
      data.fDefectQty = defectQty;
      data.fPassQty = data.fInputQty + data.fInvCheckDeltaQty - data.fTakeQty - data.fDefectQty;
      return {
        ...state,
        data,
        defect,
      };
    },
  },
};
