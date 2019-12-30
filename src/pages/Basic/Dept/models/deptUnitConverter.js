import { fakeUpdateUnitConverter, fakeGetUnitConverters } from '@/services/Basic/Dept';

export default {
  namespace: 'deptUnitConverterManage',

  state: {
    deptUnitConverters: [],
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(fakeGetUnitConverters, payload.id);
      yield put({
        type: 'save',
        payload: { deptUnitConverters: response },
      });
    },
    *change({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: { deptUnitConverters: payload },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdateUnitConverter, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
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
