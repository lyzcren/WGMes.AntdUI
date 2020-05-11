import { fakeAnalysis, fakeChartData } from '@/services/Chart/Analysis';

export default {
  namespace: 'chart',

  state: {
    workshops: [],
    processes: [],
    visitData: [],
    visitData2: [],
    produceData: [],
    passRateData: [],
    topProduces: [],
    topMachineProduces: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const { beginDate, endDate } = payload;
      const workshops = yield call(fakeAnalysis, {
        ...payload,
        beginDate: beginDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      const response = {
        workshops: workshops.workshops,
        processes: workshops.processes,
      };
      // console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchWorkshopData({ payload }, { call, put }) {
      const { beginDate, endDate } = payload;
      const response = yield call(fakeChartData, {
        ...payload,
        beginDate: beginDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
      // console.log(response);
      yield put({
        type: 'save',
        payload: {
          produceData: response.produceData,
          passRateData: response.passRateData,
          topProduces: response.topProduces,
          topMachineProduces: response.topMachineProduces,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        workshops: [],
        processes: [],
        visitData: [],
        visitData2: [],
        produceData: [],
        passRateData: [],
        topProduces: [],
        topMachineProduces: [],
      };
    },
  },
};
