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
      title: '开始时间',
      dataIndex: 'fBeginTime',
      width: 160,
    },
    {
      title: '结束时间',
      dataIndex: 'fEndTime',
      width: 160,
    },
    {
      title: '最迟结束时间',
      dataIndex: 'fLastEndTime',
      width: 160,
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
    },
    {
      title: '创建时间',
      dataIndex: 'fCreateDate',
      width: 220,
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 260,
      autoFixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="WorkTime_Update">
            <a onClick={() => this.updateHandler(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="WorkTime_Active">
            <a onClick={() => this.activeHandler(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="WorkTime_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteHandler(record)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  updateHandler = record => {};

  deleteHandler = record => {};

  activeHandler = record => {};
}

const columnConfig = new ColumnConfig();
export default columnConfig;
