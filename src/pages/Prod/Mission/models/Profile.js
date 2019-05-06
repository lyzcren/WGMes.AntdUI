
import { fakeGet, } from '@/services/Prod/Mission';
import GlobalConst from '@/utils/GlobalConst'

export default {
  namespace: 'missionProfile',

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
      const data = yield call(fakeGet, payload);
      const fStatus = GlobalConst.PlanStatusData.find((item, index) => item.value == data.fStatus);
      data.fStatusName = fStatus ? fStatus.text : '';

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
