import React, { Fragment } from 'react';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { Switch, Popconfirm, Divider, Tooltip, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

class ColumnConfig {
  columns = [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
      render: (val, record) => {
        return (
          <div style={{ display: 'flex' }}>
            {val && (
              <Tooltip
                placement="topLeft"
                title={<QRCode value={val} size={200} fgColor="#000000" />}
              >
                <QRCode style={{ marginRight: '6px' }} value={val} size={19} fgColor="#666666" />
              </Tooltip>
            )}
            <a onClick={() => this.handleViewFlow(record)}>{val}</a>
          </div>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'fQty',
      width: 220,
      sorter: true,
    },
    {
      title: '操作员',
      dataIndex: 'fOperatorName',
      width: 120,
      sorter: true,
    },
    {
      title: '原因',
      dataIndex: 'fReason',
      width: 120,
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
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
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
    if (hasAuthority('BatchSplit_Rollback')) {
      const allColumns = [
        ...this.columns,
        {
          title: '操作',
          dataIndex: 'operators',
          // fixed: 'right',
          width: 120,
          render: (text, record) => {
            const operators = [];
            if (hasAuthority('BatchSplit_Rollback') && !record.fCancellation) {
              operators.push((text, record) => (
                <Authorized key={'rollback'} authority="BatchSplit_Rollback">
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

  handleViewFlow = () => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
