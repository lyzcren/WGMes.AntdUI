import {
  fakeQueryGroups,
  fakeQueryPrintTemplate,
  fakeRemovePrintTemplate,
} from '@/services/Sys/PrintTemplate';

export default {
  namespace: 'printTemplateManage',

  state: {
    groups: [],
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *groups({ payload }, { call, put }) {
      const response = yield call(fakeQueryGroups, payload);
      yield put({
        type: 'save',
        payload: { groups: response },
      });
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, payload);
      yield put({
        type: 'save',
        payload: { printTemplates: response },
      });
    },
    *removePrintTemplate({ payload }, { call, put }) {
      const response = yield call(fakeRemovePrintTemplate, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
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
