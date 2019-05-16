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
          currentStep = steps.length;
        } else {
          const findGroup = steps.find(step => step.fRouteGroupID === dept.fRouteGroupID);
          if (!findGroup) {
            steps.push({
              order: steps.length + 1,
              fRouteGroupID: dept.fRouteGroupID,
              depts: [dept],
            });
          } else {
            findGroup.depts.push(dept);
          }
        }
      });

      steps.map(step => {
        step.title = step.depts.map(dept => dept.fDeptName).join(' & ');
        if (step.depts.length === 1) {
          const record = step.depts[0];
          if (record.fStatus === 2) {
            step.description = (
              <span>
                {'【' +
                  record.fOperatorName +
                  '】于 ' +
                  moment(record.fTransferDate).format('YYYY-MM-DD HH:mm') +
                  ' 完成，耗时【' +
                  getTimeDiff(new Date(record.fBeginDate), new Date(record.fTransferDate)) +
                  '】' +
                  '，良率：' +
                  numeral((record.fPassQty * 100) / record.fInputQty).format('0.00') +
                  '%'}
              </span>
            );
          } else if (record.fStatus === 1) {
            step.description = '签收于  ' + moment(record.fSignDate).format('YYYY-MM-DD HH:mm');
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
