import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeCheck,
  fakeQueryGroupBy,
} from '@/services/Prod/Report';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';

export default {
  namespace: 'reportManage',

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
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *check({ payload }, { call, put }) {
      const response = yield call(fakeCheck, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'prodReport' });
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
  },
};
