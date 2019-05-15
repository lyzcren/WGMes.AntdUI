import { fakeChartData } from '@/services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
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
    *fetch (_, { call, put }) {
      // const response = yield call(fakeChartData);
      const response =  { "visitData": [{ "x": "2019-05-15", "y": 7 }, { "x": "2019-05-16", "y": 5 }, { "x": "2019-05-17", "y": 4 }, { "x": "2019-05-18", "y": 2 }, { "x": "2019-05-19", "y": 4 }, { "x": "2019-05-20", "y": 7 }, { "x": "2019-05-21", "y": 5 }, { "x": "2019-05-22", "y": 6 }, { "x": "2019-05-23", "y": 5 }, { "x": "2019-05-24", "y": 9 }, { "x": "2019-05-25", "y": 6 }, { "x": "2019-05-26", "y": 3 }, { "x": "2019-05-27", "y": 1 }, { "x": "2019-05-28", "y": 5 }, { "x": "2019-05-29", "y": 3 }, { "x": "2019-05-30", "y": 6 }, { "x": "2019-05-31", "y": 5 }], "visitData2": [{ "x": "2019-05-15", "y": 1 }, { "x": "2019-05-16", "y": 6 }, { "x": "2019-05-17", "y": 4 }, { "x": "2019-05-18", "y": 8 }, { "x": "2019-05-19", "y": 3 }, { "x": "2019-05-20", "y": 7 }, { "x": "2019-05-21", "y": 2 }], "salesData": [{ "x": "1月", "y": 942 }, { "x": "2月", "y": 703 }, { "x": "3月", "y": 797 }, { "x": "4月", "y": 781 }, { "x": "5月", "y": 344 }, { "x": "6月", "y": 735 }, { "x": "7月", "y": 544 }, { "x": "8月", "y": 962 }, { "x": "9月", "y": 775 }, { "x": "10月", "y": 1001 }, { "x": "11月", "y": 497 }, { "x": "12月", "y": 612 }], "searchData": [{ "index": 1, "keyword": "搜索关键词-0", "count": 931, "range": 7, "status": 1 }, { "index": 2, "keyword": "搜索关键词-1", "count": 476, "range": 87, "status": 0 }, { "index": 3, "keyword": "搜索关键词-2", "count": 683, "range": 46, "status": 1 }, { "index": 4, "keyword": "搜索关键词-3", "count": 105, "range": 14, "status": 0 }, { "index": 5, "keyword": "搜索关键词-4", "count": 314, "range": 32, "status": 0 }, { "index": 6, "keyword": "搜索关键词-5", "count": 339, "range": 49, "status": 0 }, { "index": 7, "keyword": "搜索关键词-6", "count": 688, "range": 65, "status": 1 }, { "index": 8, "keyword": "搜索关键词-7", "count": 841, "range": 53, "status": 0 }, { "index": 9, "keyword": "搜索关键词-8", "count": 79, "range": 39, "status": 0 }, { "index": 10, "keyword": "搜索关键词-9", "count": 313, "range": 99, "status": 0 }, { "index": 11, "keyword": "搜索关键词-10", "count": 944, "range": 84, "status": 1 }, { "index": 12, "keyword": "搜索关键词-11", "count": 392, "range": 81, "status": 1 }, { "index": 13, "keyword": "搜索关键词-12", "count": 659, "range": 12, "status": 0 }, { "index": 14, "keyword": "搜索关键词-13", "count": 163, "range": 83, "status": 0 }, { "index": 15, "keyword": "搜索关键词-14", "count": 1, "range": 8, "status": 0 }, { "index": 16, "keyword": "搜索关键词-15", "count": 92, "range": 7, "status": 1 }, { "index": 17, "keyword": "搜索关键词-16", "count": 325, "range": 64, "status": 1 }, { "index": 18, "keyword": "搜索关键词-17", "count": 863, "range": 49, "status": 0 }, { "index": 19, "keyword": "搜索关键词-18", "count": 912, "range": 28, "status": 0 }, { "index": 20, "keyword": "搜索关键词-19", "count": 734, "range": 75, "status": 0 }, { "index": 21, "keyword": "搜索关键词-20", "count": 200, "range": 77, "status": 0 }, { "index": 22, "keyword": "搜索关键词-21", "count": 505, "range": 17, "status": 1 }, { "index": 23, "keyword": "搜索关键词-22", "count": 88, "range": 19, "status": 0 }, { "index": 24, "keyword": "搜索关键词-23", "count": 563, "range": 62, "status": 1 }, { "index": 25, "keyword": "搜索关键词-24", "count": 874, "range": 38, "status": 0 }, { "index": 26, "keyword": "搜索关键词-25", "count": 110, "range": 5, "status": 0 }, { "index": 27, "keyword": "搜索关键词-26", "count": 548, "range": 60, "status": 1 }, { "index": 28, "keyword": "搜索关键词-27", "count": 533, "range": 63, "status": 1 }, { "index": 29, "keyword": "搜索关键词-28", "count": 755, "range": 25, "status": 0 }, { "index": 30, "keyword": "搜索关键词-29", "count": 371, "range": 3, "status": 0 }, { "index": 31, "keyword": "搜索关键词-30", "count": 76, "range": 22, "status": 1 }, { "index": 32, "keyword": "搜索关键词-31", "count": 101, "range": 96, "status": 0 }, { "index": 33, "keyword": "搜索关键词-32", "count": 226, "range": 28, "status": 0 }, { "index": 34, "keyword": "搜索关键词-33", "count": 818, "range": 86, "status": 0 }, { "index": 35, "keyword": "搜索关键词-34", "count": 663, "range": 62, "status": 0 }, { "index": 36, "keyword": "搜索关键词-35", "count": 128, "range": 6, "status": 1 }, { "index": 37, "keyword": "搜索关键词-36", "count": 219, "range": 78, "status": 1 }, { "index": 38, "keyword": "搜索关键词-37", "count": 635, "range": 24, "status": 0 }, { "index": 39, "keyword": "搜索关键词-38", "count": 428, "range": 65, "status": 1 }, { "index": 40, "keyword": "搜索关键词-39", "count": 979, "range": 29, "status": 1 }, { "index": 41, "keyword": "搜索关键词-40", "count": 860, "range": 1, "status": 0 }, { "index": 42, "keyword": "搜索关键词-41", "count": 740, "range": 19, "status": 0 }, { "index": 43, "keyword": "搜索关键词-42", "count": 207, "range": 35, "status": 1 }, { "index": 44, "keyword": "搜索关键词-43", "count": 331, "range": 57, "status": 1 }, { "index": 45, "keyword": "搜索关键词-44", "count": 747, "range": 33, "status": 1 }, { "index": 46, "keyword": "搜索关键词-45", "count": 181, "range": 73, "status": 1 }, { "index": 47, "keyword": "搜索关键词-46", "count": 608, "range": 7, "status": 0 }, { "index": 48, "keyword": "搜索关键词-47", "count": 179, "range": 94, "status": 0 }, { "index": 49, "keyword": "搜索关键词-48", "count": 925, "range": 82, "status": 1 }, { "index": 50, "keyword": "搜索关键词-49", "count": 296, "range": 59, "status": 1 }], "offlineData": [{ "name": "Stores 0", "cvr": 0.6 }, { "name": "Stores 1", "cvr": 0.1 }, { "name": "Stores 2", "cvr": 0.7 }, { "name": "Stores 3", "cvr": 0.9 }, { "name": "Stores 4", "cvr": 0.1 }, { "name": "Stores 5", "cvr": 0.1 }, { "name": "Stores 6", "cvr": 0.9 }, { "name": "Stores 7", "cvr": 0.2 }, { "name": "Stores 8", "cvr": 0.6 }, { "name": "Stores 9", "cvr": 0.9 }], "offlineChartData": [{ "x": 1557882091514, "y1": 67, "y2": 101 }, { "x": 1557883891514, "y1": 80, "y2": 12 }, { "x": 1557885691514, "y1": 17, "y2": 108 }, { "x": 1557887491514, "y1": 27, "y2": 23 }, { "x": 1557889291514, "y1": 35, "y2": 44 }, { "x": 1557891091514, "y1": 33, "y2": 74 }, { "x": 1557892891514, "y1": 68, "y2": 65 }, { "x": 1557894691514, "y1": 105, "y2": 93 }, { "x": 1557896491514, "y1": 100, "y2": 76 }, { "x": 1557898291514, "y1": 48, "y2": 17 }, { "x": 1557900091514, "y1": 30, "y2": 64 }, { "x": 1557901891514, "y1": 85, "y2": 73 }, { "x": 1557903691514, "y1": 70, "y2": 86 }, { "x": 1557905491514, "y1": 49, "y2": 13 }, { "x": 1557907291514, "y1": 56, "y2": 22 }, { "x": 1557909091514, "y1": 22, "y2": 57 }, { "x": 1557910891514, "y1": 87, "y2": 46 }, { "x": 1557912691514, "y1": 17, "y2": 62 }, { "x": 1557914491514, "y1": 56, "y2": 102 }, { "x": 1557916291514, "y1": 24, "y2": 89 }], "salesTypeData": [{ "x": "家用电器", "y": 4544 }, { "x": "食用酒水", "y": 3321 }, { "x": "个护健康", "y": 3113 }, { "x": "服饰箱包", "y": 2341 }, { "x": "母婴产品", "y": 1231 }, { "x": "其他", "y": 1231 }], "salesTypeDataOnline": [{ "x": "家用电器", "y": 244 }, { "x": "食用酒水", "y": 321 }, { "x": "个护健康", "y": 311 }, { "x": "服饰箱包", "y": 41 }, { "x": "母婴产品", "y": 121 }, { "x": "其他", "y": 111 }], "salesTypeDataOffline": [{ "x": "家用电器", "y": 99 }, { "x": "食用酒水", "y": 188 }, { "x": "个护健康", "y": 344 }, { "x": "服饰箱包", "y": 255 }, { "x": "其他", "y": 65 }], "radarData": [{ "name": "个人", "label": "引用", "value": 10 }, { "name": "个人", "label": "口碑", "value": 8 }, { "name": "个人", "label": "产量", "value": 4 }, { "name": "个人", "label": "贡献", "value": 5 }, { "name": "个人", "label": "热度", "value": 7 }, { "name": "团队", "label": "引用", "value": 3 }, { "name": "团队", "label": "口碑", "value": 9 }, { "name": "团队", "label": "产量", "value": 6 }, { "name": "团队", "label": "贡献", "value": 3 }, { "name": "团队", "label": "热度", "value": 1 }, { "name": "部门", "label": "引用", "value": 4 }, { "name": "部门", "label": "口碑", "value": 1 }, { "name": "部门", "label": "产量", "value": 6 }, { "name": "部门", "label": "贡献", "value": 5 }, { "name": "部门", "label": "热度", "value": 7 }] };
      // console.log(response);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData (_, { call, put }) {
      const response = yield call(fakeChartData);
      console.log(response);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },

  reducers: {
    save (state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear () {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
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
