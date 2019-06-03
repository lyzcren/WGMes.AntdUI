import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      sorter: true,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="PrintTemplate_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="PrintTemplate_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delete(record)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  UpdateModalVisibleCallback = record => {};
  updateModalVisible = record => {
    this.UpdateModalVisibleCallback(record);
  };

  // 删除方法
  DeleteCallback = record => {};
  delete = record => {
    this.DeleteCallback(record);
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
