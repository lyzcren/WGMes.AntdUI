import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

const activeData = ['启用', '禁用'];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 260,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 260,
      sorter: true,
    },
    {
      title: '参数类型',
      dataIndex: 'fTypeName',
      width: 260,
      sorter: true,
    },
    {
      title: '参数值',
      dataIndex: 'values',
      width: 260,
      render(val) {
        return val.join(', ');
      },
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
      title: '创建人',
      dataIndex: 'fCreatorName',
      width: 220,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'fCreateDate',
      width: 220,
      sorter: true,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operator',
      width: 260,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Param_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => this._valuesModalVisible(record)}>参数值</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Param_Active">
            <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Param_Delete">
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

  // 参数方法
  ValuesModalVisibleCallback = record => {};
  _valuesModalVisible = record => {
    this.ValuesModalVisibleCallback(record);
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

let columnConfig = new ColumnConfig();
export default columnConfig;
