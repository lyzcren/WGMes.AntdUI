import { fakeAdd } from '@/services/Basic/UnitConverter';
import { exists } from 'fs';

export default {
  namespace: 'unitConverterCreate',

  state: {
    data: {},

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload, callback }, { call, put }) {
      const data = yield call(fakeGetProducingRecord, payload);
      data.fPassQty = data.fInputQty + data.fInvCheckDeltaQty - data.fTakeQty;
      yield put({
        type: 'save',
        payload: {
          data,
          defectList: [],
        },
      });
      if (callback) callback();
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'save',
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
  },
};
