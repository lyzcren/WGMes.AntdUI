import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';

const activeData = ['启用', '禁用',];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      sorter: true,
    },
    {
      title: '英文名称',
      dataIndex: 'fEnName',
      sorter: true,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      filters: [
        {
          text: activeData[0],
          value: 1,
        },
        {
          text: activeData[1],
          value: 0,
        },
      ],
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this._updateModalVisible(record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this._delete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this._handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  UpdateModalVisibleCallback = (record) => { };
  _updateModalVisible = (record) => {
    this.UpdateModalVisibleCallback(record);
  };

  // 删除方法
  DeleteCallback = (record) => { };
  _delete = (record) => {
    this.DeleteCallback(record);
  };

  // 删除方法
  ActiveCallback = (record) => { };
  _handleActive = (record) => {
    this.ActiveCallback(record);
  };

}

let columnConfig = new ColumnConfig();
export default columnConfig;