import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '部门',
      dataIndex: 'fDeptName',
      width: 120,
      sorter: true,
    },
    {
      title: '部门编码',
      dataIndex: 'fDeptNumber',
      width: 120,
      sorter: true,
    },
    {
      title: '物料名称',
      dataIndex: 'fProductName',
      width: 120,
      sorter: true,
    },
    {
      title: '物料编码',
      dataIndex: 'fProductNumber',
      width: 220,
      sorter: true,
    },
    {
      title: '规格型号',
      dataIndex: 'fModel',
      width: 220,
      sorter: true,
    },
    {
      title: '不良名称',
      dataIndex: 'fDefectName',
      width: 120,
      sorter: true,
    },
    {
      title: '不良编码',
      dataIndex: 'fDefectNumber',
      width: 220,
      sorter: true,
    },
    {
      title: '不良数量',
      dataIndex: 'fQty',
      width: 120,
      sorter: true,
    },
    {
      title: '单位',
      dataIndex: 'fUnitName',
      width: 120,
    },
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 220,
      sorter: true,
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 220,
      sorter: true,
    },
    {
      title: '车间',
      dataIndex: 'fWorkShopName',
      width: 150,
      sorter: true,
    },
    {
      title: '车间编码',
      dataIndex: 'fWorkShopNumber',
      width: 220,
      sorter: true,
    },
  ];
}

let columnConfig = new ColumnConfig();
export default columnConfig;
