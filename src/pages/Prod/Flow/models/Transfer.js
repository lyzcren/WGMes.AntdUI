import { fakeGetProducingRecord, fakeTransfer } from '@/services/Prod/Record';
import { fakeGetDefect, fakeMachineData } from '@/services/basicData';
import { fakeQueryParams } from '@/services/Tech/Route';
import { defaultCipherList } from 'constants';
import { exists } from 'fs';

export default {
  namespace: 'flowTransfer',

  state: {
    data: {},
    defect: [],
    machineData: [],
    defectList: [],
    paramList: [],

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
    *getParams({ payload, callback }, { call, put }) {
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
      if (callback) callback();
    },
    *changeParam({ payload, callback }, { call, put, select }) {
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
      if (callback) callback();
    },
    *getDefect({ payload, callback }, { call, put }) {
      const response = yield call(fakeGetDefect, payload);

      yield put({
        type: 'saveDefect',
        payload: response,
      });
      if (callback) callback();
    },
    *changeDefect({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeDefectReducer',
        payload,
      });
      if (callback) callback();
    },
    *addDefect({ payload, callback }, { call, put, select }) {
      const { fDefectID, fValue } = payload;
      const { defectList } = yield select(state => state.flowTransfer);
      const { defectData } = yield select(state => state.basicData);
      const existsOne = defectList.find(x => x.fItemID == fDefectID);
      const findItem = defectData.find(x => (x.fItemID = fDefectID));
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
      if (callback) callback();
    },
    *transfer({ payload, callback }, { call, put }) {
      const response = yield call(fakeTransfer, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
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
        .filter(x => x.fValue)
        .map(x => x.fValue)
        .reduce((sum, x) => (sum += x));
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
