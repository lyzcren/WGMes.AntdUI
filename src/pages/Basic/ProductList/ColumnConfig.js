import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

const activeData = ['启用', '禁用'];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 200,
      sorter: true,
    },
    {
      title: '全称',
      dataIndex: 'fFullName',
      width: 300,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 200,
      sorter: true,
    },
    {
      title: '规格',
      dataIndex: 'fModel',
      width: 300,
      sorter: true,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      width: 100,
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
      title: '工艺路线',
      dataIndex: 'fRouteName',
      width: 150,
      sorter: true,
    },
    {
      title: '物料属性',
      dataIndex: 'fErpClsName',
      width: 150,
      sorter: true,
    },
    {
      title: '单位',
      dataIndex: 'fUnitName',
      width: 100,
    },
    {
      title: '副单位',
      dataIndex: 'fUnitName2',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Product_Update">
            <a onClick={() => this.updateModalVisible(record)}>路线</a>
          </Authorized>
          <Authorized authority="Product_Active">
            <Divider type="vertical" />
            <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
          </Authorized>
          <Authorized authority="Product_Delete">
            <Divider type="vertical" />
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
