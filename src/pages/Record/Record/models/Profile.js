import { fakeGet } from '@/services/Prod/Record';
import { fakeGet as fakeGetConverter } from '@/services/Basic/UnitConverter';
import { getConvertQty, getUnconvertQty, getConvertQtyWithDecimal } from '@/utils/unitConvertUtil';

export default {
  namespace: 'recordProfile',

  state: {
    data: {},
    matchConverter: null,
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const data = yield call(fakeGet, payload);
      // 根据单位的小数位数配置相关数量的小数位
      data.fQtyDecimal = data.fQtyDecimal || 0;
      data.fQtyFormat = '0.' + '00000000'.slice(0, data.fQtyDecimal);

      let matchConverter = null;
      if (data.fUnitConverterID) {
        matchConverter = yield call(fakeGetConverter, data.fUnitConverterID);
        if (matchConverter) {
          const { fOutUnitID, fOutUnitName, fOutUnitNumber, fDecimal } = matchConverter;
          data.fConvertQtyFormat = '0.' + '000000000'.slice(0, fDecimal);
        }
      }
      yield put({
        type: 'save',
        payload: {
          data,
        },
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
