import React, { PureComponent, Fragment } from 'react';
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
      title: '前缀',
      dataIndex: 'fPrefix',
      sorter: true,
    },
    {
      title: '编码长度',
      dataIndex: 'fNoLength',
    },
    {
      title: '后缀',
      dataIndex: 'fSuffix',
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'fComments',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="BillNoRule_Update">
            <a onClick={() => this._updateModalVisible(record)}>修改</a>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  UpdateModalVisibleCallback = (record) => { };
  _updateModalVisible = (record) => {
    this.UpdateModalVisibleCallback(record);
  };

}

let columnConfig = new ColumnConfig();
export default columnConfig;