import { fakeUpdateBasic, fakeUpdateSync } from '@/services/Sys/BusinessConfig';
import { modeValueMaps } from '@/utils/GlobalConst';

export default {
  namespace: 'businessConfig',

  state: {
    defaultLoginMode: 'idCard',
  },

  effects: {
    *updateBasic({ payload }, { call, put, select }) {
      const { allowLoginModes, defaultLoginMode } = payload;
      const allowLoginModesValue = allowLoginModes.reduce((acc, cur) => {
        return acc | modeValueMaps[cur];
      }, 0);
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
    *updateSync({ payload }, { call, put, select }) {
      const response = yield call(fakeUpdateSync, payload);
      yield put({
        type: 'save',
        payload: { ...payload },
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
