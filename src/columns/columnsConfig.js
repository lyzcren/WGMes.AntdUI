import { columns as flow } from './Prod/Flow';
import { columns as unitConverter } from './Basic/UnitConverter';
import { columns as dept } from './Basic/Dept';

export const columnConfig = {
  flow,
  unitConverter,
  dept,
};

export const getColumns = options => {
  const { key, columnOps } = options;
  const newColumns = (columnConfig[key] || []).map(column => {
    let retColumn = { ...column };
    if (columnOps) {
      const columnOp = columnOps.find(x => x.dataIndex === column.dataIndex) || [];
      retColumn = { ...retColumn, ...columnOp };
    }

    return retColumn;
  });

  return newColumns;
};
