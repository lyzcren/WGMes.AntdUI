import moment from 'moment';
import numeral from 'numeral';
import { getTimeDiff } from '@/utils/utils';
import { fakeGetRecord } from '@/services/Prod/Flow';

export default {
  namespace: 'viewRecord',

  state: {
    steps: [],
    currentStep: 0,
    records: [],
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const response = yield call(fakeGetRecord, payload);
      // 查询工艺路线步骤
      const steps = [];
      let currentStep = 0;
      response.forEach(dept => {
        if (dept.fOrder) {
          steps.push({ order: steps.length + 1, depts: [dept] });
        } else {
          const findGroup = steps.find(step => step.fGroupID === dept.fGroupID);
          if (!findGroup) {
            steps.push({
              order: steps.length + 1,
              fGroupID: dept.fGroupID,
              depts: [dept],
            });
          } else {
            findGroup.depts.push(dept);
          }
        }
        if (dept.fOrder && dept.fStatus > 1) {
          currentStep = steps.length;
        }
      });

      steps.map(step => {
        step.title = step.depts
          .map(dept => dept.fDeptName + (dept.fIsReproduce ? '（重做）' : ''))
          .join(' & ');
        if (step.depts.length === 1 && step.depts[0].fStatus === 2) {
          step.recordId = step.depts[0].fInterID;
        }
        if (step.depts.length === 1) {
          const record = step.depts[0];
          if (record.fStatusNumber === 'ManufEndProduce') {
            step.description = (
              <span>
                {'【' +
                  record.fOperatorName +
                  '】于 ' +
                  moment(record.fTransferDateTime).format('YYYY-MM-DD HH:mm') +
                  ' 完成，耗时【' +
                  getTimeDiff(new Date(record.fBeginDate), new Date(record.fTransferDateTime)) +
                  '】' +
                  '，良率：' +
                  numeral((record.fPassQty * 100) / record.fInputQty).format('0.00') +
                  '%'}
              </span>
            );
          } else if (record.fStatusNumber === 'ManufProducing') {
            step.description =
              (record.fSignUserName ? `【${record.fSignUserName}】` : '自动') +
              '签收于  ' +
              moment(record.fSignDate).format('YYYY-MM-DD HH:mm');
          } else if (record.fStatusNumber === 'ManufRefund') {
            step.description = '已退回';
          } else if (record.fStatusNumber === 'ManufCancel') {
            step.description = record.fStatusName;
          } else {
          }
        }
      });

      yield put({
        type: 'save',
        payload: { steps, currentStep },
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
