import { fakePage, fakeRemove, fakeCheck, fakeUncheck } from '@/services/Prod/MergeMission';
import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';
import { getFiltersAndSorter } from '@/utils/wgUtils';

export default {
  namespace: 'mergeMissionManage',

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
      const mergeMissionManage = yield select(state => state.mergeMissionManage);
      const { pagination } = mergeMissionManage;
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
    *check({ payload }, { call, put }) {
      const response = yield call(fakeCheck, payload.id);

      return response;
    },
    *uncheck({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeUncheck, id);

      return response;
    },
    *getPrintTemplates({ payload }, { call, put }) {
      const response = yield call(fakeQueryPrintTemplate, { number: 'ProdMergeMission' });
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
