
import { fakeCurrentRecord, } from '@/services/Prod/Flow';

export default {
  namespace: 'flowTransfer',

  state: {
    data: {

    },

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel ({ payload, callback }, { call, put }) {
      const data = yield call(fakeCurrentRecord, payload);

      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveData (state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
