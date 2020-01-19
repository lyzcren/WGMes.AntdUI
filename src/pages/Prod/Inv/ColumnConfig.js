import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import moment from 'moment';
import numeral from 'numeral';

class ColumnConfig {
  getColumns = ({
    groupByBatchNo,
    groupByMission,
    groupByMo,
    groupByWorkShop,
    groupByDept,
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
          sorter: true,
        },
        {
          title: '车间编码',
          dataIndex: 'fWorkShopNumber',
          width: 150,
          sorter: true,
        },
      ];
    }
    if (groupByDept) {
      columns = [
        ...columns,
        {
          title: '岗位',
          dataIndex: 'fDeptName',
          width: 150,
          sorter: true,
        },
        {
          title: '岗位编码',
          dataIndex: 'fDeptNumber',
          width: 150,
          sorter: true,
        },
      ];
    }
    if (groupByMission || groupByMo) {
      columns = [
        ...columns,
        {
          title: '生产任务单',
          dataIndex: 'fMoBillNo',
          width: 150,
          sorter: true,
        },
      ];
    }
    if (groupByBatchNo) {
      columns = [
        ...columns,
        {
          title: '批号',
          dataIndex: 'fFullBatchNo',
          width: 150,
          sorter: true,
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
          sorter: true,
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
          sorter: true,
        },
        {
          title: '规格型号',
          dataIndex: 'fProductModel',
          width: 220,
        },
      ];
    }
    columns = [
      ...columns,
      {
        title: '数量',
        dataIndex: 'fPassQty',
        width: 100,
      },
    ];

    return columns;
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
