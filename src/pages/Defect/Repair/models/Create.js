import { fakeAdd, fakeCheck, fakeScan } from '@/services/Defect/Repair';
import { fakeQuery as queryDefect, fakeFetch } from '@/services/Prod/ProdDefect';

export default {
  namespace: 'repairCreate',

  state: {
    details: [],
    moBillNoList: [],
    currentMo: {},
    defectInv: [],
  },

  effects: {
    *init ({ _ }, { call, put }) {
      yield put({
        type: 'save',
        payload: { details: [] },
      });
    },
    *submit ({ payload }, { call, put }) {
      const { check } = payload;
      let response = yield call(fakeAdd, payload);
      if (check && response.model) {
        response = yield call(fakeCheck, response.model.fInterID);
      }

      return response;
    },
    *changeDetails ({ payload }, { call, put }) {
      const { details } = payload;
      yield put({
        type: 'save',
        payload: { details },
      });
    },
    *scan ({ payload }, { call, put, select }) {
      const response = yield call(fakeScan, payload);
      const details = yield select(state => state.repairCreate.details);
      if (response) {
        if (!details.find(x => x.fInterID === response.fInterID)) {
          details.push(response);
        }
        yield put({
          type: 'save',
          payload: { details },
        });
      }
      if (response) {
        return { success: true };
      }
      return { success: false, message: '未找到明细' };
    },
    *fetchMoBill ({ payload }, { call, put, select }) {
      const currentPagination = {
        current: 1,
        pageSize: 50,
        ...payload
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
            fProductModel: item.fProductModel
          });
        }
      });
      yield put({
        type: 'save',
        payload: {
          moBillNoList
        },
      });
    },
    *moBillNoChange ({ payload }, { call, put, select }) {
      const repairCreate = yield select(state => state.repairCreate);
      const { missionId } = payload;
      const currentMo = repairCreate.moBillNoList.find(x => x.fMissionID === missionId);

      const defectInv = yield call(fakeFetch, payload);
      const details = defectInv.map((d, i) => {
        return {
          ...d,
          fEntryID: i + 1,
          fRepairQty: d.fCurrentQty,
          fDefectInvID: d.fInterID
        }
      });

      yield put({
        type: 'save',
        payload: {
          currentMo,
          defectInv,
          details
        },
      });
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
