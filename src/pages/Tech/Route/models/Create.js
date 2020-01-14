import { fakeGet, fakeQuerySteps, fakeAdd } from '@/services/Tech/Route';

export default {
  namespace: 'routeCreate',

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

      const { fName } = data;
      yield put({
        type: 'save',
        payload: {
          data: {
            ...data,
            fName: `${fName}-复制`,
          },
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
    *submit({ payload }, { call, put, select }) {
      const { steps } = yield select(state => state.routeCreate);
      const submitSteps = [];
      steps.forEach((group, groupId) => {
        group.depts
          .filter(d => d.fDeptID > 0)
          .forEach(dept => {
            submitSteps.push({
              fGroupID: groupId,
              fEntryID: dept.fEntryID,
              fDeptID: dept.fDeptID,
              fRequireMachine: dept.fRequireMachine,
              fAutoSign: dept.fAutoSign,
            });
          });
      });
      if (!submitSteps || submitSteps.length <= 0) {
        yield put({
          type: 'save',
          payload: {
            queryResult: {
              status: 'warning',
              message: '工艺路线未添加任何岗位',
            },
          },
        });
      } else {
        const response = yield call(fakeAdd, { ...payload, steps: submitSteps });
        yield put({
          type: 'save',
          payload: { queryResult: response },
        });
      }
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
