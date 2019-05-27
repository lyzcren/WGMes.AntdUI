import { fakeAdd, fakeInvByDept } from '@/services/Prod/InvCheck';

export default {
  namespace: 'invCheckCreate',

  state: {
    data: {
      fBillNo: 'bi123',
      fDate: Date.now(),
      fTotalDeltaQty: 0,
      fDeptID: 0,
      fDeptName: '部门',
      fComments: '备注信息',
    },

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);

      yield put({
        type: 'saveData',
        response,
      });
    },
    *getInvByDept({ payload }, { call, put }) {
      const response = yield call(fakeInvByDept, payload);

      yield put({
        type: 'save',
        payload: { details: response },
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
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
