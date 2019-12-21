import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import moment from 'moment';

class ColumnConfig {
  getColumns = ({
    groupByDept,
    groupByDate,
    groupByMachine,
    groupByMission,
    groupByFlow,
    groupByOperator,
    groupByProduct,
  }) => {
    let columns = [];
    if (groupByDept) {
      columns = [
        ...columns,
        {
          title: '岗位',
          dataIndex: 'fDeptName',
          sorter: true,
          width: 150,
        },
        {
          title: '岗位编码',
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
          render: val => moment(val).format('YYYY-MM-DD'),
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
    if (groupByFlow) {
      columns = [
        ...columns,
        {
          title: '批号',
          dataIndex: 'fBatchNo',
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
        title: '生产时长',
        dataIndex: 'fProduceMinute',
        width: 100,
      },
      {
        title: '停线时长',
        dataIndex: 'fStopMinute',
        width: 100,
      },
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
        title: '单位',
        dataIndex: 'fUnitName',
        width: 100,
      },
    ];

    return columns;
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
