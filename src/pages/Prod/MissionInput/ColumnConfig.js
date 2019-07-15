import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '批号',
      dataIndex: 'fBatchNo',
      width: 220,
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this.handleViewFlow(record)}>{val}</a>;
      },
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '投入批数',
      dataIndex: 'fTotalBatchCount',
      width: 120,
      sorter: true,
    },
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 200,
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this.handleViewMission(record)}>{val}</a>;
      },
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'fProductName',
      width: 150,
    },
    {
      title: '产品全称',
      dataIndex: 'fProductFullName',
      width: 350,
    },
    {
      title: '产品编码',
      dataIndex: 'fProductNumber',
      sorter: true,
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'fModel',
      width: 220,
    },
    {
      title: '工艺路线',
      dataIndex: 'fRouteName',
      width: 150,
    },
    {
      title: '优先级',
      dataIndex: 'fPriority',
      sorter: true,
      width: 120,
    },
    {
      title: '车间',
      dataIndex: 'fWorkShopName',
      sorter: true,
      width: 120,
    },
    {
      title: '车间编码',
      dataIndex: 'fWorkShopNumber',
      sorter: true,
      width: 120,
    },
  ];

  // 查看任务单
  missionModalVisibleCallback = record => {};
  // 查看工艺路线
  routeModalVisibleCallback = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
