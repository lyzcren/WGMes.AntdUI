import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '单号',
      dataIndex: 'fBillNo',
      width: 150,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'fStatusName',
      width: 80,
      sorter: true,
    },
    {
      title: 'ERP汇报单号',
      dataIndex: 'fMoRptBillNo',
      width: 150,
      sorter: true,
    },
    {
      title: '创建人',
      dataIndex: 'fCreatorName',
      width: 120,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'fCreateDate',
      width: 150,
      sorter: true,
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '审核人',
      dataIndex: 'fCheckerName',
      width: 120,
      sorter: true,
    },
    {
      title: '审核时间',
      dataIndex: 'fCheckDate',
      width: 150,
      sorter: true,
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '备注',
      dataIndex: 'fComments',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 240,
      render: (text, record) => this.renderOperation(text, record),
    },
  ];

  renderOperation = (text, record) => <Fragment />;
}

const columnConfig = new ColumnConfig();
export default columnConfig;
