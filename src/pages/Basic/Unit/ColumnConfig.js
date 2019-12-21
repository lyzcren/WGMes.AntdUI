import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 160,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 160,
      sorter: true,
    },
    {
      title: '简码',
      dataIndex: 'fShortNumber',
      width: 160,
      sorter: true,
    },
    {
      title: '小数位',
      dataIndex: 'fPrecision',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 160,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Unit_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Unit_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delete(record)}>
              <a>删除</a>
            </Popconfirm>
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
