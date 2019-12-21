import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '单号',
      dataIndex: 'fBillNo',
      width: 160,
      render: (val, record) => <a onClick={() => this.profileCallback(record)}>{val}</a>,
    },
    {
      title: '岗位',
      dataIndex: 'fDeptName',
      width: 160,
    },
    {
      title: '日期',
      dataIndex: 'fDate',
      width: 160,
      render: (val, record) => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '总盈亏',
      dataIndex: 'fTotalDeltaQty',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'fStatusName',
      width: 160,
      render: (val, record) => <Badge color={record.fStatusColor} text={val} />,
    },
    {
      title: '创建人',
      dataIndex: 'fCreatorName',
      width: 160,
    },
    {
      title: '审核人',
      dataIndex: 'fCheckerName',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'fComments',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 260,
      render: (text, record) => this.renderOperation(text, record),
    },
  ];

  profileCallback = record => {};
}

const columnConfig = new ColumnConfig();
export default columnConfig;
