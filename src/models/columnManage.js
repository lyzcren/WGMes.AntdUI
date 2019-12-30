import { fakeGetColumns, fakeUpdateColumns } from '@/services/Sys/tableConfig';

const sortByEntryID = (x, y) => x.entryID - y.entryID;

export default {
  namespace: 'columnManage',

  state: {
    configs: {
      // 'flow': [
      //   {
      //     dataIndex: 'fFullBatchNo',
      //     isHidden: true,
      //   },
      //   {
      //     dataIndex: 'fCurrentPassQty',
      //     isHidden: false,
      //     width: 240,
      //   },
      // ]
    },
  },

  effects: {
    *init({ payload }, { call, put, select }) {
      const { columns, key } = payload;
      const configs = yield select(state => state.columnManage.configs);
      // 从服务器读取配置文件
      const columnsConfig = yield call(fakeGetColumns, payload);
      const newColumnsConfig = columns.map((column, index) => {
        const findItem = columnsConfig.find(x => x.dataIndex === column.dataIndex);
        return {
          title: column.title,
          dataIndex: column.dataIndex,
          entryID: columnsConfig.length <= 0 ? index : findItem ? findItem.entryID : 99999,
          isHidden: findItem ? findItem.isHidden : column.isHidden,
          width: findItem ? findItem.width : column.width,
        };
      });
      newColumnsConfig.sort(sortByEntryID).forEach((col, index) => {
        col.entryID = index + 1;
      });
      configs[key] = newColumnsConfig;
      yield put({
        type: 'save',
        payload: { configs },
      });
    },
    *changeColumn({ payload }, { call, put, select }) {
      const { column, key } = payload;
      const configs = yield select(state => state.columnManage.configs);
      let columnsConfig = configs[key] || [];
      const itemFind = columnsConfig.find(x => x.dataIndex === column.dataIndex);
      if (itemFind) {
        itemFind.isHidden = column.isHidden;
        itemFind.width = column.width;
      } else {
        columnsConfig = [...columnsConfig, column];
      }
      configs[key] = columnsConfig;
      yield put({
        type: 'save',
        payload: { configs },
      });
    },
    *moveColumn({ payload }, { call, put, select }) {
      const { key, dragName, hoverName } = payload;
      const configs = yield select(state => state.columnManage.configs);
      const columnsConfig = configs[key] || [];
      const dragRow = columnsConfig.find(x => x.dataIndex === dragName);
      const hoverRow = columnsConfig.find(x => x.dataIndex === hoverName);
      const dragIndex = columnsConfig.indexOf(dragRow);
      const hoverIndex = columnsConfig.indexOf(hoverRow);
      columnsConfig.splice(dragIndex, 1);
      columnsConfig.splice(hoverIndex, 0, dragRow);
      columnsConfig.forEach((column, index) => {
        column.entryID = index;
      });
      configs[key] = columnsConfig;
      yield put({
        type: 'save',
        payload: { configs },
      });
    },
    *saveColumns({ payload }, { call, put, select }) {
      const { key } = payload;
      const configs = yield select(state => state.columnManage.configs);
      let columnsConfig = configs[key] || [];
      columnsConfig = columnsConfig.sort(sortByEntryID);

      // save to server
      yield call(fakeUpdateColumns, { key, columns: columnsConfig });
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
