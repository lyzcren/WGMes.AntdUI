import { fakeGetProducingRecord, fakeTransfer } from '@/services/Prod/Record';
import { fakeGetDeptDefect, fakeMachineData } from '@/services/basicData';
import { fakeQueryParams } from '@/services/Tech/Route';
import { fakeGetWorkTimes, fakeGetUnitConvertersWithMatch } from '@/services/Basic/Dept';
import { defaultCipherList } from 'constants';
import {
  getConverterRate,
  getConvertQty,
  getUnconvertQty,
  getMatchConverter,
  getConvertQtyWithDecimal,
} from '@/utils/unitConvertUtil';
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
    matchConverter: {},

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const data = yield call(fakeGetProducingRecord, payload);
      data.fPassQty = data.fInputQty + data.fInvCheckDeltaQty - data.fTakeQty;
      // 根据单位的小数位数配置相关数量的小数位
      data.fQtyDecimal = data.fQtyDecimal || 0;
      data.fQtyFormat = '0.' + '00000000'.slice(0, data.fQtyDecimal);

      const { fRouteID, fRouteEntryID, fDeptID, fUnitConverterID } = data;
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
      console.log(matchConverter);
      if (matchConverter) {
        const {
          fItemID,
          fName,
          fOutUnitID,
          fOutUnitName,
          fOutUnitNumber,
          fConvertMode,
          fDecimal,
        } = matchConverter;
        // 转换后的单位
        data.fUnitConverterID = fItemID;
        data.fUnitConverterName = fName;
        data.fConvertUnitID = fOutUnitID;
        data.fConvertUnitName = fOutUnitName;
        data.fConvertUnitNumber = fOutUnitNumber;
        data.fConvertMode = fConvertMode;
        data.fConvertRate = getConverterRate(data, matchConverter);
        data.fConvertDecimal = fDecimal;
        data.fConvertQtyFormat = '0.' + '000000000'.slice(0, fDecimal);
        // 转换的投入数量
        const convertInputQty = getConvertQtyWithDecimal(data, matchConverter, data.fInputQty);
        data.fConvertInputQty = convertInputQty;
        // 转化后的合格数量
        const convertPassQty = getConvertQtyWithDecimal(
          data,
          matchConverter,
          data.fCurrentPassQty ? data.fCurrentPassQty : data.fInputQty
        );
        data.fConvertPassQty = convertPassQty;
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
          matchConverter,
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
      const { data, matchConverter, defect } = state;
      const existsDefect = defect.find(d => d.fDefectID === fDefectID);
      if (existsDefect) {
        existsDefect.fValue = fValue;
      } else {
        defect.push({ fDefectID, fValue });
      }
      const defectQty = defect
        .map(x => (x.fValue ? x.fValue : 0))
        .reduce((sum, x) => (sum += x * 1.0));
      data.fConvertDefectQty = defectQty;
      data.fDefectQty = getUnconvertQty(data, matchConverter, defectQty);
      // 所有变化的数量（取走、盘点、不良）
      const allChangeQty = data.fInvCheckDeltaQty - data.fTakeQty - data.fDefectQty;
      // 计算相关数量
      data.fPassQty = data.fInputQty + allChangeQty;
      // 所有变化的数量（取走、盘点、不良）（已转换单位）
      const allConvertChangeQty = matchConverter
        ? getConvertQtyWithDecimal(data, matchConverter, allChangeQty)
        : allChangeQty;
      data.fConvertPassQty = data.fConvertInputQty + allConvertChangeQty;
      return {
        ...state,
        data,
        defect,
      };
    },
  },
};
