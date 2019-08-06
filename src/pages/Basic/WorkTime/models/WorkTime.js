import {
  fakeQuery,
  fakeRemove,
  fakeAdd,
  fakeUpdate,
  fakeActive,
  fakeDeactive,
} from '@/services/Basic/WorkTime';

export default {
  namespace: 'workTimeManage',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeQuery, payload);
      yield put({
        type: 'save',
        payload: { data: response },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(fakeAdd, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(fakeRemove, payload.id);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *active({ payload }, { call, put }) {
      const response = yield call(fakeActive, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *deactive({ payload }, { call, put }) {
      const response = yield call(fakeDeactive, payload);
      yield put({
        type: 'save',
        payload: { queryResult: response },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(fakeUpdate, payload);
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
