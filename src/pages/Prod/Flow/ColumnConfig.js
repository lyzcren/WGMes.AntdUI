import React, { PureComponent, Fragment } from 'react';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import { Switch, Popconfirm, Divider, Badge, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';
import RadioButton from 'antd/lib/radio/radioButton';

class ColumnConfig {
  // 查看任务单
  missionModalVisibleCallback = record => {};
  // 查看工艺路线
  routeModalVisibleCallback = record => {};
  statusFilter = [];

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
              <div>{val}</div>
              {val && (
                <Tooltip
                  placement="topLeft"
                  title={<QRCode value={val} size={200} fgColor="#000000" />}
                >
                  <QRCode style={{ marginLeft: '5px' }} value={val} size={19} fgColor="#000000" />
                </Tooltip>
              )}
            </div>
          );
        },
      },
      {
        title: '良品数量',
        dataIndex: 'fCurrentPassQty',
        width: 120,
        sorter: true,
      },
      {
        title: '投入数量',
        dataIndex: 'fInputQty',
        width: 120,
        sorter: true,
      },
      {
        title: '良品率',
        dataIndex: 'fCurrentPassRate',
        width: 120,
        render: (val, record) => {
          return record.fCurrentPassQty
            ? numeral((record.fCurrentPassQty * 100.0) / record.fInputQty).format('0.00') + '%'
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
        title: '当前工序',
        dataIndex: 'fCurrentDeptName',
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
        title: '总投入数量',
        dataIndex: 'fTotalInputQty',
        width: 130,
        sorter: true,
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
        title: '工艺路线',
        dataIndex: 'fRouteName',
        width: 150,
        render: (val, record) => {
          return <a onClick={() => this.routeModalVisibleCallback(record)}>{val}</a>;
        },
      },
      {
        title: '工艺路线编码',
        dataIndex: 'fRouteNumber',
        width: 150,
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
        title: '汇报单',
        dataIndex: 'fMoRptBillNo',
        sorter: true,
        width: 120,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 250,
        render: (text, record) => this.renderOperation(text, record),
      },
    ];
  };

  renderOperation = (text, record) => {
    return <Fragment />;
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
