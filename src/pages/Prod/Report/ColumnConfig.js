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
      title: '撤销人',
      dataIndex: 'fCancellationUserName',
      width: 220,
      sorter: true,
    },
    {
      title: '撤销时间',
      dataIndex: 'fCancellationDate',
      width: 220,
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
      width: 220,
      render: (text, record) => this.renderOperation(text, record),
    },
  ];

  renderOperation = (text, record) => {
    return <Fragment />;
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
