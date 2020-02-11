import { fakeChartData } from '@/services/api';
import { fakeAnalysis } from '@/services/Chart/Analysis';

export default {
  namespace: 'chart',

  state: {
    workshops: [],
    processes: [],
    visitData: [],
    visitData2: [],
    producesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const workshops = yield call(fakeAnalysis);
      const response = {
        workshops: workshops.workshops,
        processes: workshops.processes,
        producesData: [
          { x: '1月', y: 942 },
          { x: '2月', y: 703 },
          { x: '3月', y: 797 },
          { x: '4月', y: 781 },
          { x: '5月', y: 344 },
          { x: '6月', y: 735 },
          { x: '7月', y: 544 },
          { x: '8月', y: 962 },
          { x: '9月', y: 775 },
          { x: '10月', y: 1001 },
          { x: '11月', y: 497 },
          { x: '12月', y: 612 },
        ],
      };
      // console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(_, { call, put }) {
      console.log('fetchSalesData');
      const response = yield call(fakeChartData);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          producesData: response.producesData,
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
        visitData: [],
        visitData2: [],
        producesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
