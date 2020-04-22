import { fakePage, fakeRemove, fakeCheck, fakeUncheck } from '@/services/Defect/Report';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';
import { getFiltersAndSorter } from '@/utils/wgUtils';

export default {
  namespace: 'reportManage',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    selectedRows: [],
    printTemplates: [],
  },

  effects: {
    *fetch({ payload = {} }, { call, put, select }) {
      const reportManage = yield select(state => state.reportManage);
      const { pagination } = reportManage;
      const filtersAndSorter = getFiltersAndSorter(payload);
      const currentPagination = { ...pagination, ...payload, ...filtersAndSorter };

      const response = yield call(fakePage, currentPagination);
      yield put({
        type: 'save',
        payload: {
          pagination: currentPagination,
          ...response,
        },
      });
    },
    *selectedRows({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          selectedRows: payload,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload.fInterID);
      yield put({
        type: 'save',
        payload: {
          selectedRows: [],
        },
      });

      return response;
    },
    *check({ payload }, { call, put }) {
      const response = yield call(fakeCheck, payload.fInterID);

      return response;
    },
    *uncheck({ payload }, { call, put }) {
      const { fInterID } = payload;
      const response = yield call(fakeUncheck, fInterID);

      return response;
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'DefectReport' });
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
