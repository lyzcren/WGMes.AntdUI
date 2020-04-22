import { fakeGet, fakeUpdate, fakeCheck } from '@/services/Defect/Report';
import { fakeQuery as queryDefect, fakeFetch } from '@/services/Defect/Inv';

export default {
  namespace: 'reportUpdate',

  state: {
    details: [],
    defectInv: [],
    newBill: {},
  },

  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeGet, id);
      const moBillNoList = [
        {
          fMissionID: response.fMissionID,
          fMoBillNo: response.fMoBillNo,
          fSoBillNo: response.fSoBillNo,
          fProductName: response.fProductName,
          fProductNumber: response.fProductNumber,
          fProductModel: response.fProductModel,
        },
      ];
      yield put({
        type: 'save',
        payload: { ...response, moBillNoList },
      });
    },
    *submit({ payload }, { call, put }) {
      const { check, id } = payload;
      let response = yield call(fakeUpdate, id, payload);
      // 修改成功，审核
      if (check && response.status === 'ok') {
        const responseCheck = yield call(fakeCheck, id);
        if (responseCheck.status === 'ok') {
          return { ...response, message: '审核成功.' };
        } else {
          return { ...response, message: '新增成功,' + responseCheck.message };
        }
      }
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
    *loadDefectInv({ payload }, { call, put, select }) {
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
