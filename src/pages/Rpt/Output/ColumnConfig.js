import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import moment from 'moment';

class ColumnConfig {
  getColumns = ({
    groupByWorkShop,
    groupByDept,
    groupByDate,
    groupByMachine,
    groupByMission,
    groupByOperator,
    groupByProduct,
  }) => {
    let columns = [];
    if (groupByWorkShop) {
      columns = [
        ...columns,
        {
          title: '车间',
          dataIndex: 'fWorkShopName',
          width: 150,
        },
        {
          title: '车间编码',
          dataIndex: 'fWorkShopNumber',
          width: 150,
        },
      ];
    }
    if (groupByDept) {
      columns = [
        ...columns,
        {
          title: '部门',
          dataIndex: 'fDeptName',
          sorter: true,
          width: 150,
        },
        {
          title: '部门编码',
          dataIndex: 'fDeptNumber',
          sorter: true,
          width: 150,
        },
      ];
    }
    if (groupByDate) {
      columns = [
        ...columns,
        {
          title: '日期',
          dataIndex: 'fTransferDate',
          width: 120,
          render: val => {
            return moment(val).format('YYYY-MM-DD');
          },
        },
      ];
    }
    if (groupByMission) {
      columns = [
        ...columns,
        {
          title: '生产任务单',
          dataIndex: 'fMoBillNo',
          width: 150,
        },
        {
          title: '订单',
          dataIndex: 'fSoBillNo',
          width: 150,
        },
      ];
    }
    if (groupByProduct) {
      columns = [
        ...columns,
        {
          title: '物料名称',
          dataIndex: 'fProductName',
          width: 220,
        },
        {
          title: '物料全称',
          dataIndex: 'fProductFullName',
          width: 350,
        },
        {
          title: '物料编码',
          dataIndex: 'fProductNumber',
          width: 220,
        },
        {
          title: '规格型号',
          dataIndex: 'fProductModel',
          width: 220,
        },
      ];
    }
    if (groupByMachine) {
      columns = [
        ...columns,
        {
          title: '机台名称',
          dataIndex: 'fMachineName',
          width: 150,
        },
        {
          title: '机台编码',
          dataIndex: 'fMachineNumber',
          width: 150,
        },
      ];
    }
    if (groupByOperator) {
      columns = [
        ...columns,
        {
          title: '操作员',
          dataIndex: 'fOperatorName',
          width: 150,
        },
        {
          title: '操作员编码',
          dataIndex: 'fOperatorNumber',
          width: 150,
        },
      ];
    }
    columns = [
      ...columns,
      {
        title: '投入数量',
        dataIndex: 'fInputQty',
        width: 100,
      },
      {
        title: '产出数量',
        dataIndex: 'fPassQty',
        width: 100,
      },
      {
        title: '不良数量',
        dataIndex: 'fDefectQty',
        width: 100,
      },
      {
        title: '退回数量',
        dataIndex: 'fRefundQty',
        width: 100,
      },
      {
        title: '取走数量',
        dataIndex: 'fTakeQty',
        width: 100,
      },
      {
        title: '盘点盈亏数量',
        dataIndex: 'fInvCheckDeltaQty',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
        width: 100,
      },
      // {
      //   title: '生产时长',
      //   dataIndex: 'fProduceMinute',
      //   width: 100,
      // },
      // {
      //   title: '停线时长',
      //   dataIndex: 'fStopMinute',
      //   width: 100,
      // },
    ];

    return columns;
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
