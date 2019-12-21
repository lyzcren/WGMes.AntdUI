import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider, Tag } from 'antd';
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
      title: '英文名称',
      dataIndex: 'fEnName',
      width: 160,
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'fTypeName',
      width: 160,
      sorter: true,
    },
    {
      title: '班次',
      dataIndex: 'workTimeList',
      width: 160,
      render(val) {
        return (
          val &&
          val.map(x => (
            <Tag key={x.fWorkTimeID} color={x.fIsActive ? 'green' : undefined}>
              {x.fWorkTimeName}
            </Tag>
          ))
        );
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
      title: '操作',
      dataIndex: 'operators',
      width: 160,
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

const columnConfig = new ColumnConfig();
export default columnConfig;
