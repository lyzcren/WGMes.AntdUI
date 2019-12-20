import React, { Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import { Switch, Popconfirm, Divider, Badge, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  getColumns = () => {
    return [
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
              <a onClick={() => this.profileVisible(record)}>{val}</a>
            </div>
          );
        },
      },
      {
        title: '岗位',
        dataIndex: 'fDeptName',
        width: 120,
        sorter: true,
      },
      {
        title: '流程单数量',
        dataIndex: 'fFlowInputQty',
        width: 150,
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
        title: '良品率',
        dataIndex: 'fPassRate',
        width: 120,
        render: (val, record) => {
          return record.fPassQty
            ? numeral((record.fPassQty * 100.0) / record.fInputQty).format('0.00') + '%'
            : '';
        },
      },
      {
        title: '状态',
        dataIndex: 'fStatusNumber',
        width: 150,
        render: (val, record) => <Badge color={record.fStatusColor} text={record.fStatusName} />,
        filters: this.statusFilter,
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
        dataIndex: 'fTransferDateTime',
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
        title: '班次',
        dataIndex: 'fWorkTimeName',
        width: 150,
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
      {
        title: '操作',
        dataIndex: 'operators',
        fixed: 'right',
        width: 80,
        render: (text, record) => this.renderOperation(text, record),
      },
    ];
  };

  renderOperation = (text, record) => {
    return (
      <Fragment>
        <Authorized authority="Record_Read">
          <a onClick={() => this.profileVisible(record)}>详情</a>
        </Authorized>
      </Fragment>
    );
  };

  statusFilter = [];

  // 查看任务单
  missionModalVisibleCallback = record => {};

  // 详情
  profileVisible = record => {};
}

let columnConfig = new ColumnConfig();
export default columnConfig;
