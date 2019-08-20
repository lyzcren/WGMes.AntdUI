import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

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
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
      render: (val, record) => {
        if (record.fCancellation) {
          return <Badge color={'#696969'} text={'已撤销'} />;
        }
        return <Badge color={'green'} text={'正常'} />;
      },
      // filters: this.statusFilter,
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
    {
      title: '撤销人',
      dataIndex: 'fCancellationUserName',
      width: 220,
      sorter: true,
    },
    {
      title: '撤销时间',
      dataIndex: 'fCancellationDate',
      width: 220,
      sorter: true,
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
  ];
  getColumns = () => {
    if (hasAuthority('MissionInput_Rollback')) {
      const allColumns = [
        ...this.columns,
        {
          title: '操作',
          // fixed: 'right',
          width: 120,
          render: (text, record) => {
            const operators = [];
            if (hasAuthority('MissionInput_Rollback') && !record.fCancellation) {
              operators.push((text, record) => (
                <Authorized key={'rollback'} authority="MissionInput_Rollback">
                  <Popconfirm
                    title="是否要撤销此记录？"
                    onConfirm={() => this.handleRollback(record)}
                  >
                    <a>撤销</a>
                  </Popconfirm>
                </Authorized>
              ));
            }
            return <Fragment>{operators.map(x => x(text, record))}</Fragment>;
          },
        },
      ];
      return allColumns;
    } else {
      return this.columns;
    }
  };
  handleRollback = record => {};

  // 查看任务单
  missionModalVisibleCallback = record => {};
  // 查看工艺路线
  routeModalVisibleCallback = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
