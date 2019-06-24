import moment from 'moment';
import numeral from 'numeral';
import { fakeGetTake } from '@/services/Prod/Flow';

export default {
  namespace: 'viewTake',

  state: {
    records: [],
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const response = yield call(fakeGetTake, payload);

      yield put({
        type: 'save',
        payload: { records: response },
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
