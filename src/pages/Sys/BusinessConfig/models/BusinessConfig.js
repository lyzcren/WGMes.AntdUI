import { fakeFetch, fakeUpdateBasic } from '@/services/Sys/BusinessConfig';
import { modeValueMaps } from '@/utils/GlobalConst';

export default {
  namespace: 'businessConfig',

  state: {
    defaultLoginMode: 'idCard',
  },

  effects: {
    *fetch({}, { call, put }) {
      const response = yield call(fakeFetch);
      let configs = {};
      response.forEach(item => {
        const { fNumber, fValue } = item;
        if (fNumber === 'allowLoginModes') {
          configs[fNumber] = Object.keys(modeValueMaps).filter(x => modeValueMaps[x] & fValue);
        } else if (fNumber === 'defaultLoginMode') {
          configs[fNumber] = Object.keys(modeValueMaps).find(x => modeValueMaps[x] == fValue);
        } else {
          configs[fNumber] = fValue;
        }
      });
      yield put({
        type: 'save',
        payload: { ...configs },
      });
    },
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
