import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

const activeData = ['启用', '禁用'];

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
      title: '序列号',
      dataIndex: 'fSerialNumber',
      width: 160,
      sorter: true,
    },
    {
      title: '岗位',
      dataIndex: 'fDeptName',
      width: 160,
      sorter: true,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      width: 160,
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
      render(val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 160,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Machine_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Machine_Active">
            <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Machine_Delete">
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

  // 删除方法
  ActiveCallback = record => {};

  handleActive = record => {
    this.ActiveCallback(record);
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
