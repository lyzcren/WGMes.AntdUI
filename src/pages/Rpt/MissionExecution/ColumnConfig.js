import React, { Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';
import moment from 'moment';
import numeral from 'numeral';

class ColumnConfig {
  getColumns = ({
    groupByDate,
    groupByMission,
    groupByMo,
    groupBySo,
    groupByWorkShop,
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
    if (groupByMission || groupByMo) {
      columns = [
        ...columns,
        {
          title: '生产任务单',
          dataIndex: 'fMoBillNo',
          width: 150,
        },
      ];
    }
    if (groupByMission || groupBySo) {
      columns = [
        ...columns,
        {
          title: '订单',
          dataIndex: 'fSoBillNo',
          width: 150,
        },
      ];
    }
    if (groupByDate) {
      columns = [
        ...columns,
        {
          title: '日期',
          dataIndex: 'fDate',
          width: 150,
          render: val => moment(val).format('YYYY-MM-DD'),
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
    columns = [
      ...columns,
      {
        title: '计划数量',
        dataIndex: 'fPlanQty',
        width: 100,
      },
      {
        title: '投入数量',
        dataIndex: 'fInputQty',
        width: 100,
      },
      {
        title: '一次良品',
        dataIndex: 'fPassQty',
        width: 100,
      },
      {
        title: '最终良品',
        dataIndex: 'fPassQty2',
        width: 100,
      },
      {
        title: '一次良率',
        dataIndex: 'fPassRate',
        width: 100,
        render: value => `${numeral(value * 100).format('0.00')}%`,
      },
      {
        title: '最终良率',
        dataIndex: 'fPassRate2',
        width: 100,
        render: value => `${numeral(value * 100).format('0.00')}%`,
      },
    ];

    return columns;
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
