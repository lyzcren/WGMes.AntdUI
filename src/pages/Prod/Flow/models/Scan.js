import { fakeGet, fakeGetDepts } from '@/services/Prod/Flow';

export default {
  namespace: 'flowScan',

  state: {
    data: {},
    message: '',
    messageType: '',
    showSign: false,
    showTransfer: false,
    matchConverter: null,
    nextDepts: [],
  },

  effects: {
    *initModel({}, { call, put }) {
      yield put({
        type: 'save',
        payload: { data: {}, message: '', messageType: '', showSign: false, showTransfer: false },
      });
    },

    *get({ payload }, { call, put }) {
      const data = yield call(fakeGet, payload);
      let message = '';
      let showSign = false;
      let showTransfer = false;
      let messageType = '';
      const { fNextDeptIDList } = data;
      const nextDepts = yield call(fakeGetDepts, { fInterID: data.fInterID });
      if (!data) {
        message = `未找到流程单【${fFullBatchNo}】.`;
        messageType = 'error';
      } else {
        const { fStatusNumber, fRecordStatusNumber } = data;
        // 判断是否可签收
        if (
          fStatusNumber === 'Reported' ||
          fStatusNumber === 'EndProduce' ||
          fStatusNumber === 'NonProduced'
        ) {
          messageType = 'warning';
          message = '当前流程单已结束生产.';
        } else if (fRecordStatusNumber !== 'ManufProducing') {
          showSign = true;
        } else if (fRecordStatusNumber === 'ManufProducing') {
          showTransfer = true;
        }
      }
      const { fConvertDecimal, fQtyDecimal } = data;
      // 根据单位的小数位数配置相关数量的小数位
      data.fQtyDecimal = fQtyDecimal || 0;
      data.fQtyFormat = '0.' + '00000000'.slice(0, fQtyDecimal);
      data.fConvertQtyFormat = '0.' + '000000000'.slice(0, fConvertDecimal);
      yield put({
        type: 'save',
        payload: { data, message, messageType, showSign, showTransfer, nextDepts },
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
