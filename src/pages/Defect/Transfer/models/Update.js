import { fakeGet, fakeUpdate, fakeSign } from '@/services/Defect/Transfer';
import { fakeQuery as queryDefect, fakeFetch } from '@/services/Defect/Inv';

export default {
  namespace: 'transferUpdate',

  state: {
    details: [],
    newBill: {},
  },

  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeGet, id);
      yield put({
        type: 'save',
        payload: response,
      });
      const newBill = yield call(fakeGet, id);
      yield put({
        type: 'save',
        payload: { newBill },
      });
    },
    *submit({ payload }, { call, put }) {
      const { check, id } = payload;
      let response = yield call(fakeUpdate, id, payload);
      if (check && response.model) {
        response = yield call(fakeSign, id);
      }

      return response;
    },
    *changeDetails({ payload }, { call, put }) {
      const { details } = payload;
      yield put({
        type: 'save',
        payload: { details },
      });
    },
    *loadInv({ payload }, { call, put, select }) {
      const transferCreate = yield select(state => state.transferCreate);

      const defectInv = yield call(fakeFetch, payload);
      const details = defectInv.map((d, i) => {
        return {
          ...d,
          fEntryID: i + 1,
          fQty: d.fCurrentQty,
          fDefectInvID: d.fInterID,
        };
      });

      yield put({
        type: 'save',
        payload: {
          defectInv,
          details,
        },
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
