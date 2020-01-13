import { fakeAdd } from '@/services/Tech/Route';

export default {
  namespace: 'routeCreate',

  state: {
    steps: [],
    currentStep: 0,

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({}, { put }) {
      yield put({
        type: 'save',
        payload: {
          steps: [],
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
          type: 'saveData',
          payload: {
            status: 'warning',
            message: '工艺路线未添加任何岗位',
          },
        });
      } else {
        const response = yield call(fakeAdd, { ...payload, steps: submitSteps });
        yield put({
          type: 'saveData',
          payload: response,
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
    saveData(state, action) {
      return {
        ...state,
        queryResult: action.payload ? action.payload : {},
      };
    },
  },
};
