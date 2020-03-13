import screenfull from 'screenfull';

export function print (module, grfId, id) {
  const w = window.open('about:blank');
  let env = process.env.NODE_ENV;
  if (env === 'development') {
    w.location.href = `/print/${module}/${grfId}/${id}`;
  } else {
    w.location.href = `http://print.ywlin.cn/print/${module}/${grfId}/${id}`;
  }
}

export function autoSreenfull () {
  try {
    setTimeout(() => {
      if (!screenfull.isFullscreen) {
        if (screenfull.enabled) {
          screenfull.request();
        }
      }
    }, 2000);
  } catch (error) {
    autoSreenfull();
  }
}

export function watchFullScreen (dispatch) {
  const screenChange = () => {
    dispatch({
      type: 'global/fullScreen',
      payload: {
        isFullScreen: screenfull.isFullscreen,
      },
    });
  };
  if (screenfull.enabled) {
    screenfull.on('change', screenChange);
  }
}

export function changeFullScreen () {
  try {
    if (screenfull.isFullscreen) {
      screenfull.exit();
    } else {
      screenfull.request();
    }
  } catch (error) { }
}

export function getColumns ({ columns, columnOps }) {
  const newColumns = (columns || []).map(column => {
    if (columnOps) {
      const columnOp = columnOps.find(x => x.dataIndex === column.dataIndex) || [];
      const retColumn = { ...column, ...columnOp };
      return retColumn;
    }

    return column;
  });

  return newColumns;
}

const getValue = obj =>
  Object.keys(obj)
    .map(key => `'${obj[key]}'`)
    .join(',');

export function getFiltersAndSorter ({ filters = {}, sorter = {} }) {
  const result = {};
  if (filters && Object.keys(filters).length > 0) {
    result.filters = Object.keys(filters).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filters[key]);
      return newObj;
    }, {});
  }
  if (sorter && Object.keys(sorter).length > 0) {
    result.sorter = {};
    result.sorter[sorter.field] = sorter.order.replace('ascend', 'asc').replace('descend', 'desc');
  }
  return result;
}
