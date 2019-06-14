import { fakeQueryPrintTemplate } from '@/services/Sys/PrintTemplate';

export default {
  namespace: 'printTemplate',

  state: {},

  effects: {
    *getPrintTemplates({ payload }, { call, put, select }) {
      const { number } = payload;
      const response = yield call(fakeQueryPrintTemplate, payload);
      const newStatus = yield select(state => state.printTemplate);
      newStatus[number] = response;
      yield put({
        type: 'save',
        payload: { response },
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
