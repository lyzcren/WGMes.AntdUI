import React, { Fragment } from 'react';
import moment from 'moment';
import QRCode from 'qrcode.react';
import { Switch, Popconfirm, Divider, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';

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
  ];

  handleViewFlow = () => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
