import moment from 'moment';
import numeral from 'numeral';
import { fakeGetByBatchNo as fakeGet, fakeGetDepts, fakeSign } from '@/services/Prod/Flow';

export default {
  namespace: 'scanSign',

  state: {
    records: [],
    messageInfo: '',
    deptId: 0,
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const { deptId } = payload;
      yield put({
        type: 'save',
        payload: {
          records: [],
          messageInfo: '',
          deptId,
        },
      });
    },
    *scan({ payload }, { call, put, select }) {
      const records = yield select(state => state.scanSign.records);
      const { deptId } = payload;
      const data = yield call(fakeGet, payload);
      const {
        fInterID = 0,
        fStatusNumber = '',
        fCurrentDeptName = '',
        fCurrentRecordStatusNumber = '',
      } = data;
      let messageInfo = '';
      if (!fInterID) {
        messageInfo = `未找到流程单【${payload.fFullBatchNo}】.`;
      } else if (fStatusNumber === 'EndProduce' || fStatusNumber === 'NonProduced') {
        messageInfo = '当前流程单已结束生产.';
      } else if (fCurrentRecordStatusNumber === 'ManufProducing') {
        messageInfo = `流程单在【${fCurrentDeptName}】未转出.`;
      } else if (records.find(x => x.fInterID === fInterID)) {
        messageInfo = '当前扫码记录已存在.';
      } else {
        const nextDepts = yield call(fakeGetDepts, { fInterID });
        if (!nextDepts.find(d => d.fDeptID === deptId)) {
          const { fCurrentDeptID, fFinishedRecords } = data;
          if (fCurrentDeptID === deptId) {
            messageInfo = '当前岗位已转出.';
          } else if (fFinishedRecords.find(r => r.fDeptID === deptId)) {
            messageInfo = '当前岗位已完成生产.';
          } else {
            messageInfo = '当前岗位无法签收.';
          }
        } else {
          const { fConvertDecimal, fQtyDecimal } = data;
          // 根据单位的小数位数配置相关数量的小数位
          data.fQtyDecimal = fQtyDecimal || 0;
          data.fQtyFormat = `0.${'00000000'.slice(0, fQtyDecimal)}`;
          data.fConvertQtyFormat = `0.${'000000000'.slice(0, fConvertDecimal)}`;

          records.push(data);
        }
      }
      yield put({
        type: 'save',
        payload: { records, messageInfo },
      });
    },
    *sign({ payload }, { call, put, select }) {
      const { fInterID } = payload;
      const response = yield call(fakeSign, payload);
      const records = yield select(state => state.scanSign.records);
      const record = records.find(x => x.fInterID === fInterID);
      if (record) {
        record.result = response;
      }

      yield put({
        type: 'save',
        payload: { records },
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
