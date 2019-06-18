import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import moment from 'moment';
import numeral from 'numeral';

class ColumnConfig {
  getColumns = ({
    groupByDate,
    groupByWeek,
    groupByMonth,
    groupByMachine,
    groupByMission,
    groupByOperator,
    groupByProduct,
  }) => {
    let columns = [
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
    if (groupByWeek) {
      columns = [
        ...columns,
        {
          title: '周',
          dataIndex: 'fWeek',
          width: 80,
        },
      ];
    }
    if (groupByMonth) {
      columns = [
        ...columns,
        {
          title: '月',
          dataIndex: 'fMonth',
          width: 80,
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
        title: '良品数量',
        dataIndex: 'fPassQty',
        width: 100,
      },
      {
        title: '不良数量',
        dataIndex: 'fDefectQty',
        width: 100,
      },
      {
        title: '良率',
        dataIndex: 'fPassRate',
        width: 100,
        render: value => {
          return numeral(value * 100).format('0.00') + '%';
        },
      },
    ];

    return columns;
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
