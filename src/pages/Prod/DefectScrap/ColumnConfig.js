import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 150,
      sorter: true,
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 150,
      sorter: true,
    },
    {
      title: '岗位',
      dataIndex: 'fDeptName',
      width: 120,
      sorter: true,
    },
    {
      title: '岗位编码',
      dataIndex: 'fDeptNumber',
      width: 150,
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
      title: '数量',
      dataIndex: 'fQty',
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
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
  ];
}

let columnConfig = new ColumnConfig();
export default columnConfig;
