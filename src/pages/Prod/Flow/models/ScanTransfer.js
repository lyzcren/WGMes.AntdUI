import moment from 'moment';
import numeral from 'numeral';
import { fakeGetByBatchNo as fakeGet } from '@/services/Prod/Flow';
import { fakeTransfer } from '@/services/Prod/Record';
import { fakeMachineData } from '@/services/basicData';

export default {
  namespace: 'scanTransfer',

  state: {
    records: [],
    messageInfo: '',
    deptId: 0,
    machineData: [],
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const { deptId } = payload;
      // getMachineData
      const machineData = yield call(fakeMachineData, { fDeptID: deptId });
      yield put({
        type: 'save',
        payload: {
          records: [],
          messageInfo: '',
          deptId,
          machineData,
        },
      });
    },
    *scan({ payload }, { call, put, select }) {
      const records = yield select(state => state.scanTransfer.records);
      const { deptId } = payload;
      const data = yield call(fakeGet, payload);
      const {
        fInterID = 0,
        fStatusNumber = '',
        fCurrentDeptID,
        fCurrentDeptName = '',
        fCurrentRecordStatusNumber = '',
        fFinishedRecords,
      } = data;
      let messageInfo = '';
      if (!fInterID) {
        messageInfo = `未找到流程单【${payload.fFullBatchNo}】.`;
      } else if (fStatusNumber === 'EndProduce' || fStatusNumber === 'NonProduced') {
        messageInfo = '当前流程单已结束生产.';
      } else if (fCurrentRecordStatusNumber !== 'ManufProducing') {
        messageInfo = `当前流程单状态无法转序.`;
      } else if (records.find(x => x.fInterID === fInterID)) {
        messageInfo = '当前扫码记录已存在.';
      } else if (fCurrentDeptID !== deptId) {
        messageInfo = `流程单在【${fCurrentDeptName}】,当前岗位无法转序.`;
      } else if (fFinishedRecords.find(r => r.fDeptID === deptId)) {
        messageInfo = '当前岗位已完成生产.';
      } else {
        const { fConvertDecimal, fQtyDecimal } = data;
        // 根据单位的小数位数配置相关数量的小数位
        data.fQtyDecimal = fQtyDecimal || 0;
        data.fQtyFormat = `0.${'00000000'.slice(0, fQtyDecimal)}`;
        data.fConvertQtyFormat = `0.${'000000000'.slice(0, fConvertDecimal)}`;

        records.push(data);
      }
      yield put({
        type: 'save',
        payload: { records, messageInfo },
      });
    },
    *transfer({ payload }, { call, put, select }) {
      const {
        fInterIDs,
        fOperatorID,
        fDebuggerID,
        fMachineID
      } = payload;
      const records = yield select(state => state.scanTransfer.records);
      for (const fInterID of fInterIDs) {
        const response = yield call(fakeTransfer, {
          fInterID,
          fOperatorID,
          fDebuggerID,
          fMachineID
        });
        const record = records.find(x => x.fCurrentRecordID === fInterID);
        if (record) {
          record.result = response;
        }
      }

      yield put({
        type: 'save',
        payload: { records },
      });
      yield put({
        type: 'flowManage/fetch',
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
