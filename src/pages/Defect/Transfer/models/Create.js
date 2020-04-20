import { fakeGet, fakeAdd, fakeSign } from '@/services/Defect/Transfer';
import { fakeQuery as queryDefect, fakeFetch } from '@/services/Defect/Inv';

export default {
  namespace: 'transferCreate',

  state: {
    details: [],
    defectInv: [],
    newBill: {},
  },

  effects: {
    *init({ _ }, { call, put }) {
      yield put({
        type: 'save',
        payload: { details: [] },
      });
    },
    *submit({ payload }, { call, put }) {
      const { check } = payload;
      let response = yield call(fakeAdd, payload);
      if (check && response.model) {
        response = yield call(fakeSign, response.model.fInterID);
      }
      const { id } = response;
      if (id > 0) {
        const newBill = yield call(fakeGet, id);
        yield put({
          type: 'save',
          payload: { newBill },
        });
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
