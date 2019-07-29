import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

const activeData = ['启用', '禁用'];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      sorter: true,
    },
    {
      title: '英文名称',
      dataIndex: 'fEnName',
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'fTypeName',
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
      render(val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Dept_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="BillNoRule_Update">
            <a
              disabled={record.fTypeNumber !== 'WorkShop'}
              onClick={() => this.updateFixModalVisible(record)}
            >
              编码规则
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Dept_Update">
            <a
              disabled={record.fTypeNumber != 'Process'}
              onClick={() => this.handleTechParam(record)}
            >
              工艺参数
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Dept_Active">
            <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Dept_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delete(record)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  updateModalVisible = record => {};
  updateFixModalVisible = record => {};
  delete = record => {};
  handleActive = record => {};
  handleTechParam = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
