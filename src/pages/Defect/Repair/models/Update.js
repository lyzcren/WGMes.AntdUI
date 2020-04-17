import { fakeGet, fakeUpdate, fakeCheck } from '@/services/Defect/Repair';
import { fakeQuery as queryDefect, fakeFetch } from '@/services/Defect/Inv';

export default {
  namespace: 'repairUpdate',

  state: {
    details: [],
    moBillNoList: [],
    currentMo: {},
    defectInv: [],
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
      if (check && response.model) {
        response = yield call(fakeCheck, id);
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
    *fetchMoBill({ payload }, { call, put, select }) {
      const currentPagination = {
        current: 1,
        pageSize: 50,
        ...payload,
      };
      const response = yield call(queryDefect, currentPagination);
      const moBillNoList = [];
      response.list.forEach(item => {
        if (!moBillNoList.find(x => x.fMissionID == item.fMissionID)) {
          moBillNoList.push({
            fMissionID: item.fMissionID,
            fMoBillNo: item.fMoBillNo,
            fSoBillNo: item.fSoBillNo,
            fProductName: item.fProductName,
            fProductNumber: item.fProductNumber,
            fProductModel: item.fProductModel,
          });
        }
      });
      yield put({
        type: 'save',
        payload: {
          moBillNoList,
        },
      });
    },
    *moBillNoChange({ payload }, { call, put, select }) {
      const repairCreate = yield select(state => state.repairCreate);
      const { missionId } = payload;
      const currentMo = repairCreate.moBillNoList.find(x => x.fMissionID === missionId);

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
          currentMo,
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
