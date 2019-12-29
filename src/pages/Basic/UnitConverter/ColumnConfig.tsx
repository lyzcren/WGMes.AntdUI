import { columns } from '@/columns/Basic/UnitConverter';
// tslint:disable-next-line: ordered-imports
import Authorized from '@/utils/Authorized';
import { Divider, Popconfirm } from 'antd';
import React, { Fragment } from 'react';

class ColumnConfig {
  public getColumns = options => {
    const { columnOps } = options;
    const defaultColumnOps = this.defaultColumnOps({ ...options });
    const newColumns = (columns || []).map(column => {
      let retColumn = { ...column };
      const defaultColumnOp = defaultColumnOps
        .filter(x => x.dataIndex)
        .find(x => x.dataIndex === column.dataIndex);
      if (defaultColumnOp) {
        retColumn = { ...retColumn, ...defaultColumnOp };
      }
      if (columnOps) {
        const columnOp = columnOps.find(x => x.dataIndex === column.dataIndex) || [];
        retColumn = { ...retColumn, ...columnOp };
      }

      return retColumn;
    });

    return newColumns;
  };

  private defaultColumnOps = options => {
    const { updateHandler, deleteHandler } = options || {};
    return [
      {
        title: '操作',
        dataIndex: 'operators',
        fixed: 'right',
        width: 160,
        render: (text, record) => (
          <Fragment>
            {updateHandler && (
              <Authorized authority="UnitConverter_Update">
                <a onClick={() => updateHandler(record)}> 修改 </a>
                <Divider type="vertical" />
              </Authorized>
            )}
            {deleteHandler && (
              <Authorized authority="UnitConverter_Delete">
                <Popconfirm title="是否要删除此行？" onConfirm={() => deleteHandler(record)}>
                  <a>删除 </a>
                </Popconfirm>
              </Authorized>
            )}
          </Fragment>
        ),
      },
    ];
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
