import { fakeUpdateBasic, fakeUpdateSync, fakeUpdateInv } from '@/services/Sys/BusinessConfig';
import { fakeKeyValues } from '@/services/basicData';
import { modeValueMaps } from '@/utils/GlobalConst';

export default {
  namespace: 'businessConfig',

  state: {
    defaultLoginMode: 'idCard',
    invTypes: [],
  },

  effects: {
    *updateBasic({ payload }, { call, put, select }) {
      const { allowLoginModes, defaultLoginMode } = payload;
      const allowLoginModesValue = allowLoginModes.reduce(
        (acc, cur) => acc | modeValueMaps[cur],
        0
      );
      const defaultLoginModeValue = modeValueMaps[defaultLoginMode];
      const newPayload = {
        ...payload,
        allowLoginModes: allowLoginModesValue,
        defaultLoginMode: defaultLoginModeValue,
      };
      const response = yield call(fakeUpdateBasic, newPayload);
      yield put({
        type: 'save',
        payload: { ...payload },
      });
      return response;
    },
    *updateSync({ payload }, { call, put }) {
      const response = yield call(fakeUpdateSync, payload);
      yield put({
        type: 'save',
        payload: { ...payload },
      });
      return response;
    },
    *updateInv({ payload }, { call, put }) {
      const response = yield call(fakeUpdateInv, payload);
      yield put({
        type: 'save',
        payload: { ...payload },
      });
      return response;
    },
    *getInvTypes(_, { call, put }) {
      const response = yield call(fakeKeyValues, 'invType');
      yield put({
        type: 'save',
        payload: { invTypes: response },
      });
      return response;
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
