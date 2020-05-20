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
    currentPagination: {
      current: 1,
      pageSize: 10,
    },
    data: {
      list: [],
      pagination: {},
    },
    nextDepts: [],
    printTemplates: [],
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      let currentPagination = yield select(state => state.flowManage.currentPagination);
      currentPagination = { ...currentPagination, ...payload };

      const response = yield call(fakeQuery, currentPagination);
      const list = response.list.map(x => ({ ...x, key: `${x.fInterID}${x.fRecordID || 0}` }));

      yield put({
        type: 'save',
        payload: {
          currentPagination,
          data: { ...response, list },
        },
      });
    },
    *sign({ payload }, { call, put, select }) {
      const signResult = yield call(fakeSign, payload);
      if (signResult.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

      return signResult;
    },
    *cancelTransfer({ payload }, { call, put }) {
      const response = yield call(fakeCancelTransfer, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

      return response;
    },
    *cancel({ payload }, { call, put }) {
      const response = yield call(fakeCancel, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

      return response;
    },
    *sign4Reject({ payload, callback }, { call, put }) {
      const response = yield call(fakeSign4Reject, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

      return response;
    },
    *report({ payload }, { call, put }) {
      const response = yield call(fakeReport, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

      return response;
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
      if (response.status === 'ok') {
        yield put({
          type: 'fetch',
        });
      }

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
    saveDepts(state, action) {
      return {
        ...state,
        nextDepts: action.payload,
      };
    },
  },
};
