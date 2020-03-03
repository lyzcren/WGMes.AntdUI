import { fakeGetUnitConvertersWithMatch, fakeGetWorkTimes } from '@/services/Basic/Dept';
import { fakeGetDeptDefect, fakeMachineData } from '@/services/basicData';
import { fakeGetProducingRecord, fakeTransfer } from '@/services/Prod/Record';
import { fakeQueryParams } from '@/services/Tech/Route';
import {
  getConverterRate,
  getConvertQtyWithDecimal,
  getMatchConverter,
} from '@/utils/unitConvertUtil';
import { isArray } from 'util';

export default {
  namespace: 'flowTransfer',

  state: {
    data: {
      defectList: [],
      paramList: [],
    },
    machineData: [],
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
      const { fRouteID, fRouteEntryID, fDeptID, fUnitConverterID } = data;
      // 根据单位的小数位数配置相关数量的小数位
      data.fQtyDecimal = data.fQtyDecimal || 0;
      data.fQtyFormat = `0.${'00000000'.slice(0, data.fQtyDecimal)}`;

      // getDefect 不良项处理
      const defaultDefectList = yield call(fakeGetDeptDefect, { fDeptID });
      const mergeDefectList = [
        ...defaultDefectList
          .filter(df => !data.defectList.find(rdf => rdf.fDefectID === df.fItemID))
          .map(df => ({ fDefectID: df.fItemID, fDefectName: df.fName, fQty: 0 })),
        ...data.defectList,
      ];
      data.defectList = mergeDefectList;
      data.fPassQty = data.fCurrentPassQty - data.fDefectQty;

      // getParams 工艺参数处理
      const defaultParamList = yield call(fakeQueryParams, {
        fInterID: fRouteID,
        fEntryID: fRouteEntryID,
      });
      const mergeParamList = [];
      data.paramList.forEach(dp => {
        let findParam = mergeParamList.find(md => md.fParamID === dp.fParamID);
        if (findParam) {
          findParam.fValues = [...findParam.fValues, dp.fValue];
        } else {
          findParam = { ...dp };
          findParam.fValues = [dp.fValue];
          // findParam.fValue = undefined;
          mergeParamList.push(findParam);
        }
      });

      defaultParamList.forEach(p => {
        if (p.fDefaultValue && !p.values.includes(p.fDefaultValue)) {
          p.values.unshift(p.fDefaultValue);
        }
        const findParam = mergeParamList.find(rp => rp.fParamID === p.fParamID);
        if (findParam) {
          p.fDefaultValue = findParam.fValues;
        }
        // 多选框，默认值需要是数组
        if (p.fTypeNumber === 'TagSelect' && !isArray(p.fDefaultValue)) {
          p.fDefaultValue = !!p.fDefaultValue ? [p.fDefaultValue] : [];
        }
        // 上次转序已存在的值
        p.fValues = findParam.fValues;
      });
      data.paramList = defaultParamList.filter(x => x.fIsActive);

      // getMachineData
      const machineData = yield call(fakeMachineData, { fDeptID });
      // getWorkTimes
      const workTimes = yield call(fakeGetWorkTimes, fDeptID);
      // getUnitConverters
      const unitConverters = yield call(fakeGetUnitConvertersWithMatch, fDeptID);
      const matchConverter = getMatchConverter(data, unitConverters);
      // console.log(matchConverter);
      data.fUnitName = data.fUnitName ? data.fUnitName : '';
      if (matchConverter) {
        const {
          fItemID,
          fName,
          fOutUnitName,
          fOutUnitNumber,
          fConvertMode,
          fDecimal,
        } = matchConverter;
        // 转换后的单位
        data.fUnitConverterID = fItemID;
        data.fUnitConverterName = fName;
        data.fConvertUnitName = fOutUnitName;
        data.fConvertMode = fConvertMode;
        data.fConvertRate = getConverterRate(data, matchConverter);
        data.fConvertDecimal = fDecimal;
        data.fConvertQtyFormat = `0.${'000000000'.slice(0, fDecimal)}`;
        // 转换的投入数量
        const convertInputQty = getConvertQtyWithDecimal(data, matchConverter, data.fInputQty);
        data.fConvertInputQty = convertInputQty;
        // 转化后的合格数量
        const convertPassQty = getConvertQtyWithDecimal(data, matchConverter, data.fCurrentPassQty);
        data.fConvertPassQty = convertPassQty;
      }

      yield put({
        type: 'save',
        payload: {
          data,
          // defectList: defectList || [],
          // paramList: paramList.filter(x => x.fIsActive),
          machineData,
          workTimes,
          unitConverters,
          matchConverter,
        },
      });
    },
    *changeParam({ payload }, { call, put, select }) {
      const { fParamID, fValues } = payload;
      const { data } = yield select(state => state.flowTransfer);
      const { paramList } = data;
      const existsOne = paramList.find(x => x.fParamID == fParamID);
      if (existsOne) {
        existsOne.fValues = fValues;
      }
      yield put({
        type: 'save',
        payload: { data: { ...data, paramList } },
      });
    },
    *changeDefect({ payload }, { call, put, select }) {
      const { fDefectID, fQty } = payload;
      const { defectData } = yield select(state => state.basicData);
      const defect = defectData.find(d => d.fItemID == fDefectID);
      yield put({
        type: 'changeDefectReducer',
        payload: { defect, fQty },
      });
    },
    *addDefect({ payload }, { call, put, select }) {
      const { fDefectID, fQty } = payload;
      const { data } = yield select(state => state.flowTransfer);
      const { defectList } = data;
      const { defectData } = yield select(state => state.basicData);
      const existsOne = defectList.find(x => x.fItemID === fDefectID);
      const findItem = defectData.find(x => x.fItemID === fDefectID);

      if (existsOne) {
        existsOne.fQty = fQty;
      } else if (findItem) {
        const newItem = { ...findItem };
        newItem.fQty = fQty;
        defectList.push(newItem);
      }
      put({
        type: 'save',
        payload: { data: { ...data, defectList: defectList || [] } },
      });
    },
    *transfer({ payload }, { call, put }) {
      const response = yield call(fakeTransfer, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });

      return response;
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
        payload: { defect, fQty },
      } = action;
      const { fItemID: fDefectID, fName: fDefectName, fNumber: fDefectNumber } = defect;

      const { data, matchConverter } = state;
      const { defectList } = data;
      const existsDefect = defectList.find(d => d.fDefectID === fDefectID);

      if (existsDefect) {
        existsDefect.fQty = fQty;
      } else {
        defectList.push({ fDefectID, fDefectName, fDefectNumber, fQty });
      }
      const defectQty = defectList
        .map(x => (x.fQty ? x.fQty : 0))
        .reduce((sum, x) => (sum += x * 1.0));
      data.fDefectQty = defectQty;
      // 所有变化的数量（取走、盘点、不良）
      const allChangeQty = data.fInvCheckDeltaQty - data.fTakeQty - data.fDefectQty;
      // 计算相关数量
      data.fPassQty = data.fCurrentPassQty + allChangeQty;
      if (matchConverter) {
        data.fConvertPassQty = getConvertQtyWithDecimal(data, matchConverter, data.fPassQty);
      }
      return {
        ...state,
        data: { ...data, defectList },
      };
    },
  },
};
