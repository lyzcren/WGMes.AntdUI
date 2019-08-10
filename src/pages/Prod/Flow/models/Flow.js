import {
  fakeQuery,
  fakeSign,
  fakeReport,
  fakeUpdate,
  fakeGetDepts,
  fakeSign4Reject,
  fakeCancelTransfer,
  fakeCancel,
} from '@/services/Prod/Flow';
import { fakeTake } from '@/services/Prod/Take';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';

export default {
  namespace: 'flowManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
    nextDepts: [],
    printTemplates: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *sign({ payload, callback }, { call, put }) {
      const response = yield call(fakeSign, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *cancelTransfer({ payload }, { call, put }) {
      const response = yield call(fakeCancelTransfer, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *cancel({ payload }, { call, put }) {
      const response = yield call(fakeCancel, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *sign4Reject({ payload, callback }, { call, put }) {
      const response = yield call(fakeSign4Reject, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *report({ payload, callback }, { call, put }) {
      const response = yield call(fakeReport, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
    },
    *getDepts({ payload }, { call, put }) {
      const response = yield call(fakeGetDepts, payload);
      yield put({
        type: 'saveDepts',
        payload: response,
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'prodFlow' });
      yield put({
        type: 'save',
        payload: { printTemplates: response },
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
    saveQueryData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
    saveDepts(state, action) {
      return {
        ...state,
        nextDepts: action.payload,
      };
    },
  },
};
