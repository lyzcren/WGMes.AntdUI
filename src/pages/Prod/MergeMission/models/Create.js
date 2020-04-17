import { fakeGet, fakeAdd, fakeCheck } from '@/services/Prod/MergeMission';
import { fakeGetByBillNo as fakeGetMission } from '@/services/Prod/Mission';

export default {
  namespace: 'mergeMissionCreate',

  state: {
    details: [],
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
        response = yield call(fakeCheck, response.model.fInterID);
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
    *loadBillNos({ payload }, { call, put }) {
      const { billNos } = payload;
      let missions = [];
      for (var i = 0; i < billNos.length; i++) {
        const billNo = billNos[i];
        const mission = yield call(fakeGetMission, { billNo });
        if (!mission) {
          missions.push({ fMoBillNo: billNo, fEntryID: i + 1, notFound: true });
        } else {
          missions.push({
            ...mission,
            fMissionID: mission.fInterID,
            fMoBillNo: billNo,
            fEntryID: i + 1,
          });
        }
      }
      yield put({
        type: 'save',
        payload: { details: missions },
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
