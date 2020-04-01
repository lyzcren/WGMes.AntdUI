import React, { Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import WgIcon from '@/wg_components/WgIcon';
import { Switch, Popconfirm, Divider, Badge, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  getColumns = () => [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
      render: (val, record) => (
        <div style={{ display: 'flex' }}>
          {val && (
            <Tooltip
              placement="topLeft"
              title={<QRCode value={val} size={200} fgColor="#000000" />}
            >
              <WgIcon
                style={{ marginRight: '6px' }}
                type="barcode"
                value={val}
                size={19}
                color="#666666"
              />
            </Tooltip>
          )}
          <a onClick={() => this.profileVisible(record)}>{val}</a>
        </div>
      ),
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
      render: (val, record) =>
        record.fPassQty
          ? `${numeral((record.fPassQty * 100.0) / record.fInputQty).format('0.00')}%`
          : '',
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
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '完工时间',
      dataIndex: 'fTransferDateTime',
      width: 160,
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '生产时长',
      dataIndex: 'fProduceMinute',
      width: 120,
      render: val => (val ? `${val} 分钟` : ''),
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
      render: (val, record) => (
        <a onClick={() => this.missionModalVisibleCallback(record)}>{val}</a>
      ),
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
      title: '自定义字段1',
      dataIndex: 'fMesSelf001',
      sorter: true,
      width: 120,
    },
    {
      title: '自定义字段2',
      dataIndex: 'fMesSelf002',
      sorter: true,
      width: 120,
    },
    {
      title: '自定义字段3',
      dataIndex: 'fMesSelf003',
      sorter: true,
      width: 140,
    },
    {
      title: '自定义字段4',
      dataIndex: 'fMesSelf004',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段5',
      dataIndex: 'fMesSelf005',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段6',
      dataIndex: 'fMesSelf006',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段7',
      dataIndex: 'fMesSelf007',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段8',
      dataIndex: 'fMesSelf008',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段9',
      dataIndex: 'fMesSelf009',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '自定义字段10',
      dataIndex: 'fMesSelf010',
      sorter: true,
      isHidden: true,
      width: 140,
    },
    {
      title: '操作',
      dataIndex: 'operators',
      // fixed: 'right',
      autoFixed: 'right',
      width: 80,
      render: (text, record) => this.renderOperation(text, record),
    },
  ];

  renderOperation = (text, record) => (
    <Fragment>
      <Authorized authority="Record_Read">
        <a onClick={() => this.profileVisible(record)}>详情</a>
      </Authorized>
    </Fragment>
  );

  statusFilter = [];

  // 查看任务单
  missionModalVisibleCallback = record => {};

  // 详情
  profileVisible = record => {};
}

const columnConfig = new ColumnConfig();
export default columnConfig;
