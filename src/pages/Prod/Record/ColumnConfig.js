import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import { GlobalConst, badgeStatusList } from '@/utils/GlobalConst';

class ColumnConfig {
  columns = [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
    },
    {
      title: '部门',
      dataIndex: 'fDeptName',
      width: 120,
      sorter: true,
    },
    {
      title: '流程单数量',
      dataIndex: 'fFlowInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '合格数量',
      dataIndex: 'fPassQty',
      width: 120,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
      render: (val, record) => {
        const find = badgeStatusList(GlobalConst.ManufStatusArray).find(x => x.value == val);
        if (find) {
          return find.text;
        }
        return '';
      },
      filters: badgeStatusList(GlobalConst.ManufStatusArray),
    },
    {
      title: '开工时间',
      dataIndex: 'fBeginDate',
      width: 160,
      sorter: true,
      render: val => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      title: '完工时间',
      dataIndex: 'fTransferDate',
      width: 160,
      render: val => {
        return val ? moment(val).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      title: '生产时长',
      dataIndex: 'fProduceMinute',
      width: 120,
      render: val => {
        return val ? `${val} 分钟` : '';
      },
    },
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 200,
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this.missionModalVisibleCallback(record)}>{val}</a>;
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
      width: 180,
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
      title: '产品分类',
      dataIndex: 'fErpClsName',
      sorter: true,
      width: 150,
    },
    {
      title: '优先级',
      dataIndex: 'fPriority',
      sorter: true,
      width: 120,
    },
  ];

  // 查看任务单
  MissionModalVisibleCallback = record => {};
  missionModalVisibleCallback = record => {
    this.MissionModalVisibleCallback(record);
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
