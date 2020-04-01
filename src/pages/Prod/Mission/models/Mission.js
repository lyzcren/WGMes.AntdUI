import { fakeQuery, fakeGet, fakeRemove, fakeSync } from '@/services/Prod/Mission';
import { fakeAdd as fakeAddFromMission, fakeFetchFlows } from '@/services/Prod/MissionInput';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';
import { fakeGetBillNo } from '@/services/basicData';

export default {
  namespace: 'missionManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    printTemplates: [],
    billNo: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(fakeGet, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *sync({ payload }, { call, put }) {
      const response = yield call(fakeSync, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *genFlow({ payload }, { call, put }) {
      const response = yield call(fakeAddFromMission, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'prodMission' });
      yield put({
        type: 'save',
        payload: { printTemplates: response },
      });
    },
    *getBillNo({ payload }, { call, put }) {
      const response = yield call(fakeGetBillNo, { fNumber: 'Flow' });
      yield put({
        type: 'save',
        payload: { billNo: response },
      });
    },
    *fetchFlows({ payload }, { call, put }) {
      const response = yield call(fakeFetchFlows, payload.id);
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
      };
    },
  },
};
