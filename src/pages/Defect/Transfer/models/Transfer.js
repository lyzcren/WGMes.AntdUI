import { fakePage, fakeRemove, fakeSign, fakeAntiSign } from '@/services/Defect/Transfer';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';
import { getFiltersAndSorter } from '@/utils/wgUtils';

export default {
  namespace: 'transferManage',

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
      const transferManage = yield select(state => state.transferManage);
      const { pagination } = transferManage;
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
      const response = yield call(fakeRemove, payload.id);

      return response;
    },
    *sign({ payload }, { call, put }) {
      const response = yield call(fakeSign, payload.id);

      return response;
    },
    *antiSign({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeAntiSign, id);

      return response;
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'DefectTransfer' });
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
