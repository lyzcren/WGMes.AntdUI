import { fakeGetProducingRecord, fakeTransfer } from '@/services/Prod/Record';
import { fakeGetDeptDefect, fakeMachineData } from '@/services/basicData';
import { fakeQueryParams } from '@/services/Tech/Route';
import { fakeGetWorkTimes, fakeGetUnitConvertersWithMatch } from '@/services/Basic/Dept';
import { defaultCipherList } from 'constants';
import { getMatchConverter, getConvertQtyWithDecimal } from '@/utils/unitConvertUtil';
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
    unitConverters: [],

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const data = yield call(fakeGetProducingRecord, payload);
      data.fPassQty = data.fInputQty + data.fInvCheckDeltaQty - data.fTakeQty;

      const { fRouteID, fRouteEntryID, fDeptID } = data;
      // getParams
      const paramList = yield call(fakeQueryParams, {
        fInterID: fRouteID,
        fEntryID: fRouteEntryID,
      });
      paramList.forEach(p => {
        if (!p.values.includes(p.fDefaultValue)) {
          p.values.unshift(p.fDefaultValue);
        }
      });
      // getMachineData
      const machineData = yield call(fakeMachineData, { fDeptID });
      // getDefect
      const defectList = yield call(fakeGetDeptDefect, { fDeptID });
      // getWorkTimes
      const workTimes = yield call(fakeGetWorkTimes, fDeptID);
      // getUnitConverters
      const unitConverters = yield call(fakeGetUnitConvertersWithMatch, fDeptID);
      const matchConverter = getMatchConverter(data, unitConverters);
      if (matchConverter) {
        const convertQty = getConvertQtyWithDecimal(data, matchConverter, data.fInputQty);
        console.log(convertQty);
      }

      yield put({
        type: 'save',
        payload: {
          data,
          defectList: defectList || [],
          paramList,
          machineData,
          workTimes,
          unitConverters,
        },
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
        type: 'save',
        payload: { paramList },
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
        type: 'save',
        payload: { defectList: defectList || [] },
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
