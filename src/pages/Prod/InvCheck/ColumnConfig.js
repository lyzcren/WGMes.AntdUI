import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '单号',
      dataIndex: 'fBillNo',
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
          <Authorized authority="InvCheck_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
          </Authorized>
          <Authorized authority="InvCheck_Delete">
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
}

let columnConfig = new ColumnConfig();
export default columnConfig;
