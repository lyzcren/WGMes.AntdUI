import React, { Fragment } from 'react';
import moment from 'moment';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

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
      title: '返修单号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
      render: (val, record) => {
        if (record.fCancellation) {
          return <Badge color="#696969" text="已撤销" />;
        }
        return <Badge color="green" text="正常" />;
      },
      // filters: this.statusFilter,
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
    if (hasAuthority('DefectRepair_Rollback')) {
      const allColumns = [
        ...this.columns,
        {
          title: '操作',
          dataIndex: 'operators',
          // fixed: 'right',
          width: 120,
          render: (text, record) => {
            const operators = [];
            if (hasAuthority('DefectRepair_Rollback') && !record.fCancellation) {
              operators.push((text, record) => (
                <Authorized key="rollback" authority="DefectRepair_Rollback">
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
    }
    return this.columns;
  };

  handleRollback = record => {};
}

const columnConfig = new ColumnConfig();
export default columnConfig;
