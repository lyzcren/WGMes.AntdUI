import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '单号',
      dataIndex: 'fBillNo',
      render: (val, record) => {
        return <a onClick={() => this.profileCallback(record)}>{val}</a>;
      },
    },
    {
      title: '部门',
      dataIndex: 'fDeptName',
    },
    {
      title: '日期',
      dataIndex: 'fDate',
      render: (val, record) => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '总盈亏',
      dataIndex: 'fTotalDeltaQty',
    },
    {
      title: '状态',
      dataIndex: 'fStatusName',
      render: (val, record) => <Badge color={record.fStatusColor} text={val} />,
    },
    {
      title: '创建人',
      dataIndex: 'fCreatorName',
    },
    {
      title: '审核人',
      dataIndex: 'fCheckerName',
    },
    {
      title: '备注',
      dataIndex: 'fComments',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="DefectCheck_Update">
            <a disabled={record.fStatus != 0} onClick={() => this.updateCallback(record)}>
              修改
            </a>
          </Authorized>
          <Authorized authority="DefectCheck_Check">
            <Divider type="vertical" />
            {record.fStatus === 0 ? (
              <a onClick={() => this.checkCallback(record)}>审核</a>
            ) : (
              <a onClick={() => this.uncheckCallback(record)}>反审核</a>
            )}
          </Authorized>
          <Authorized authority="DefectCheck_Delete">
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteCallback(record)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  profileCallback = record => {};
  updateCallback = record => {};
  deleteCallback = record => {};
  checkCallback = record => {};
  uncheckCallback = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
