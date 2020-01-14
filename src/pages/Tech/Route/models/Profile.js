import { fakeGet, fakeQuerySteps } from '@/services/Tech/Route';

export default {
  namespace: 'routeProfile',

  state: {
    data: {},
    steps: [],
    currentStep: 0,

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload }, { call, put }) {
      const { fInterID } = payload;
      // 查询工艺路线表头数据
      const data = yield call(fakeGet, payload.fInterID);
      // 查询工艺路线明细信息
      const response = yield call(fakeQuerySteps, payload);
      let steps = [];
      response.forEach(dept => {
        let findGroup = steps.find(step => step.fGroupID === dept.fGroupID);
        if (!findGroup) {
          findGroup = { fGroupID: dept.fGroupID, depts: [] };
          steps.push(findGroup);
        }
        findGroup.depts.push(dept);
      });
      steps = steps.sort((x, y) => x.fGroupID - y.fGroupID);
      if (steps.length <= 0) {
        steps.push({ fGroupID: 1, depts: [] });
      }

      yield put({
        type: 'save',
        payload: {
          data,
          steps,
          currentStep: 0,
        },
      });
    },
    *changeSteps({ payload }, { put }) {
      const { steps, currentStep } = payload;
      yield put({
        type: 'save',
        payload: {
          steps,
          currentStep: currentStep > 0 ? currentStep : 0,
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
