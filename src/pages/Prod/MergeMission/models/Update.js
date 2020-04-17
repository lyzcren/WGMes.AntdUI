import { fakeGet, fakeUpdate, fakeCheck } from '@/services/Prod/MergeMission';

export default {
  namespace: 'mergeMissionUpdate',

  state: {
    details: [],
  },

  effects: {
    *init({ payload }, { call, put }) {
      const { id } = payload;
      const response = yield call(fakeGet, id);
      yield put({
        type: 'save',
        payload: response,
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
