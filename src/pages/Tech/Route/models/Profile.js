import { fakeGet, fakeQuerySteps, fakeSaveSteps } from '@/services/Tech/Route';

export default {
  namespace: 'routeProfile',

  state: {
    // steps: [{
    //   fGroupID: 1,
    //   fName: '',
    //   depts: [{ fEntryID: 1, fDeptID: 1, fDeptName: '岗位1' }, { fEntryID: 2, fDeptID: 3, fDeptName: '岗位2' },],
    // }, {
    //   fGroupID: 2,
    //   fName: '',
    //   depts: [{ fEntryID: 2, fDeptID: 3, fDeptName: '岗位3' }, { fEntryID: 3, fDeptID: 3, fDeptName: '岗位5' },],
    // }, {
    //   fGroupID: 3,
    //   fName: '',
    //   depts: [{ fEntryID: 4, fDeptID: 1, fDeptName: '岗位1' },],
    // }],
    data: {},
    steps: [],
    currentStep: 0,
    maxGroupID: 1,

    queryResult: {
      status: 'ok',
      message: '',
    },
  },

  effects: {
    *initModel({ payload, callback }, { call, put }) {
      const response = yield call(fakeQuerySteps, payload);
      // 查询工艺路线步骤
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
      // 查询工艺路线表头数据
      const data = yield call(fakeGet, payload);

      yield put({
        type: 'save',
        payload: {
          data,
          steps,
          currentStep: 0,
          maxGroupID: steps.length + 1,
        },
      });
      if (callback) callback();
    },
    *nextStep({}, { put, select }) {
      const { steps, currentStep, maxGroupID } = yield select(state => state.routeProfile);
      const step = steps[currentStep];
      // 当前步骤未选择添加任何岗位，不允许再加下一个步骤
      if (step.depts.length <= 0) {
        return;
      }
      const newStep = currentStep + 1;
      if (newStep >= steps.length) {
        steps.push({
          fGroupID: maxGroupID + 1,
          fName: '',
          depts: [],
        });
      }

      const payload = { currentStep: newStep, maxGroupID: maxGroupID + 1 };
      yield put({
        type: 'save',
        payload,
      });
    },
    *prevStep({}, { put, select }) {
      const { currentStep, maxGroupID } = yield select(state => state.routeProfile);
      const newStep = currentStep - 1;

      const payload = { currentStep: newStep };
      yield put({
        type: 'save',
        payload,
      });
    },
    *deleteStep({}, { put, select }) {
      const { steps, currentStep, maxGroupID } = yield select(state => state.routeProfile);
      const newStep = currentStep - 1;
      const newSteps = steps.filter((s, i) => i !== currentStep);

      const payload = { steps: newSteps, currentStep: newStep };
      yield put({
        type: 'save',
        payload,
      });
    },
    *changeStep({ payload }, { put, select }) {
      const { steps, currentStep } = yield select(state => state.routeProfile);
      const { depts } = payload;
      const target = steps[currentStep];
      target.depts = depts;

      yield put({
        type: 'save',
        payload: { steps, currentStep },
      });
    },
    *saveStep({ payload, callback }, { call, put, select }) {
      const { steps } = yield select(state => state.routeProfile);
      const submitSteps = [];
      steps.forEach((group, groupId) => {
        group.depts.forEach(dept => {
          submitSteps.push({
            fGroupID: groupId,
            fEntryID: dept.fEntryID,
            fDeptID: dept.fDeptID,
            fRequireMachine: dept.fRequireMachine,
            fAutoSign: dept.fAutoSign,
          });
        });
      });
      const response = yield call(fakeSaveSteps, { ...payload, steps: submitSteps });

      yield put({
        type: 'saveData',
        payload: response,
      });
      if (callback) callback();
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
