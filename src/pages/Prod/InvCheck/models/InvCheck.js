import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeCheck,
  fakeUnCheck,
} from '@/services/Prod/InvCheck';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';

export default {
  namespace: 'invCheckManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    printTemplates: [],
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'saveQueryData',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *remove({ payload }, { call, put }) {
      const id = payload.fInterID;
      const response = yield call(fakeRemove, id);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *check({ payload }, { call, put }) {
      const response = yield call(fakeCheck, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *uncheck({ payload }, { call, put }) {
      const response = yield call(fakeUnCheck, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'prodInvCheck' });
      yield put({
        type: 'save',
        payload: { printTemplates: response },
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
  },
};
