import { fakeQuery } from '@/services/Defect/Inv';
import { getFiltersAndSorter } from '@/utils/wgUtils';

export default {
  namespace: 'repairChooseForm',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    selectedRows: [],
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const repairChooseForm = yield select(state => state.repairChooseForm);
      const { pagination } = repairChooseForm;
      const filtersAndSorter = getFiltersAndSorter(payload);
      const currentPagination = { ...pagination, ...payload, ...filtersAndSorter };

      const response = yield call(fakeQuery, currentPagination);
      yield put({
        type: 'save',
        payload: {
          pagination: currentPagination,
          ...response,
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
