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
      render: (text, record) => (
        <Fragment>
          {record.fStatusNumber === 'Created' && (
            <Authorized authority="Report_Update">
              <a onClick={() => this.updateHandler(record)}>修改</a>
              <Divider type="vertical" />
            </Authorized>
          )}
          {record.fStatusNumber === 'Created' && (
            <Authorized authority="Report_Check">
              <a onClick={() => this.checkHandler(record)}>审核</a>
              <Divider type="vertical" />
            </Authorized>
          )}
          {record.fStatusNumber === 'Created' && (
            <Authorized authority="Report_Delete">
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteHandler(record)}>
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical" />
            </Authorized>
          )}
          {record.fStatusNumber === 'Checked' && (
            <Authorized authority="Report_Check">
              <Popconfirm title="是否要反审核此行？" onConfirm={() => this.uncheckHandler(record)}>
                <a>反审核</a>
              </Popconfirm>
              <Divider type="vertical" />
            </Authorized>
          )}
        </Fragment>
      ),
    },
  ];

  updateHandler = record => {};

  checkHandler = record => {};

  uncheckHandler = record => {};

  deleteHandler = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
